"use client";

import NewDocumentModal from "@/components/auth/addModal";
import { SkeletonTable } from "@/components/mainPage/skeletonTable";
import DocumentTable from "@/components/mainPage/table";
import axiosClient from "@/lib/axiosClient";
import { TableData } from "@/types/types";
import { Button, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";


export default function Home() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<TableData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = () => {
    axiosClient
      .get('/ru/data/v3/testmethods/docs/userdocs/get')
      .then((response) => {
        setData(response.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('Не получилось получить данные!');
        setData([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessToken) {
      fetchData()

      const id = setInterval(() => {
        fetchData();
      }, 10000);

      setIntervalId(id);
      
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    } else {
      setIsLoading(false);
    }
  }, [status, session]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveEntry = (data: TableData) => {
    setIsLoading(true);
    if (data.employeeSigDate) data.employeeSigDate = new Date(data.employeeSigDate).toISOString() + "\t";
    if (data.companySigDate) data.companySigDate = new Date(data.companySigDate).toISOString() + "\t";
    
    const { id, ...tableDataWithoutId } = data;

    axiosClient
        .post("/ru/data/v3/testmethods/docs/userdocs/create",
          tableDataWithoutId)
        .then((response) => {
          console.log(response)
          setData((data) => [...data, response.data.data]);
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Не получилось обновить данные!");
          setIsLoading(false);
        });
  };

  const handleDeleteEntry = (id: string) => {
    axiosClient
        .post(`/ru/data/v3/testmethods/docs/userdocs/delete/${id}`)
        .then((response) => {
          if (response.data.error_code == 0) {
            setData((prevData) => prevData.filter((entry) => entry.id !== id));
          } else {
            toast.error("Не получилось удалить документ!");
          }
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Не получилось удалить документ!");
          setIsLoading(false);
        });
  };


  return (
    <Container maxWidth="lg" className="mt-10">
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Документы
      </Typography>
      {isLoading ? <SkeletonTable /> : <DocumentTable 
      data={data} 
      onDelete={handleDeleteEntry}/>}
      <Button className="mt-4 mx-2" onClick={handleOpenModal}>
        Добавить
      </Button>
      <NewDocumentModal open={isModalOpen} handleClose={handleCloseModal} handleSave={handleSaveEntry} />
      <ToastContainer />
    </Container>
  );
}
