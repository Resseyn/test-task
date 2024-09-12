"use client";

import NewDocumentModal from "@/components/auth/addModal";
import EditDocumentModal from "@/components/auth/editModal";
import { SkeletonTable } from "@/components/mainPage/skeletonTable";
import DocumentTable from "@/components/mainPage/table";
import axiosClient from "@/lib/axiosClient";
import { TableData } from "@/types/types";
import { formatDateTimeForInput } from "@/utils/helpers";
import { Button, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";


export default function Home() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [editEntryId, setEditEntryId] = useState<string | null>(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleOpenModal = (type: string) => {
    switch (type) {
      case "add":
        setIsAddModalOpen(true);
      case "edit":
        setIsEditModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false);
    setEditEntryId(null);
  };

  const handleSaveEntry = (data: TableData) => {
    if (data.employeeSigDate) data.employeeSigDate = new Date(data.employeeSigDate).toISOString() + "\t";
    if (data.companySigDate) data.companySigDate = new Date(data.companySigDate).toISOString() + "\t";
    
    const { id, ...tableDataWithoutId } = data;
    setIsLoading(true);
    axiosClient
        .post("/ru/data/v3/testmethods/docs/userdocs/create",
          tableDataWithoutId)
        .then((response) => {
          toast("Успешно добавлено!")
          setData((data) => [...data, response.data.data]);
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Не получилось обновить данные!");
          setIsLoading(false);
        });
  };

  const handleDeleteEntry = (id: string) => {
    setIsLoading(true);
    axiosClient
        .post(`/ru/data/v3/testmethods/docs/userdocs/delete/${id}`)
        .then((response) => {
          if (response.data.error_code == 0) {
            toast("Успешно удалено!")
            setData((prevData) => prevData.filter((entry) => entry.id !== id));
            setIsLoading(false);
          } else {
            toast.error("Не получилось удалить документ!");
            setIsLoading(false);
          }
        })
        .catch(() => {
          toast.error("Не получилось удалить документ!");
          setIsLoading(false);
        });
  };

  const handleEditEntry = (data: TableData) => {
    const oldEmloyeeSigDate = data.employeeSigDate
    const oldCompanySigDate = data.companySigDate

    if (data.employeeSigDate) data.employeeSigDate = new Date(data.employeeSigDate).toISOString() + "\t";
    if (data.companySigDate) data.companySigDate = new Date(data.companySigDate).toISOString() + "\t";
    setIsLoading(true);
    axiosClient
        .post(`/ru/data/v3/testmethods/docs/userdocs/set/${data.id}`,
          data)
        .then((response) => {
          if (response.data.error_code == 0) {
            toast("Успешно изменено!")

            setData((prevData) => {
              const index = prevData?.findIndex(item => item.id === data.id);
              
              if (index !== undefined && index !== -1) {
                const updatedData = [...prevData!];
                data.employeeSigDate = oldEmloyeeSigDate;
                data.companySigDate = oldCompanySigDate;
                updatedData[index] = data;
                return updatedData;
              }
              
              return prevData;
            });
            setIsLoading(false);
            setEditEntryId(null)
          } else {
            toast.error("Не получилось удалить документ!");
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          toast.error("Не получилось обновить данные!");
        });
  };

  const onEdit = (id: string) => {
    setEditEntryId(id)
    handleOpenModal("edit")
  }

  const getEditEntry = () => {
    if (data && editEntryId) {
      return data.find(item => item.id === editEntryId);
    }
    return null;
  };

  return (
    <Container maxWidth="lg" className="mt-10">
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Документы
      </Typography>
      {isLoading ? <SkeletonTable /> : <DocumentTable 
        data={data} 
        onEdit={onEdit}
        onDelete={handleDeleteEntry}/>}
      <Button className="mt-4 mx-2" onClick={() => {handleOpenModal("add")}}>
        Добавить
      </Button>
      <NewDocumentModal open={isAddModalOpen} handleClose={handleCloseModal} handleSave={handleSaveEntry} />
      {!!editEntryId && <EditDocumentModal open={isEditModalOpen} handleClose={handleCloseModal} defaultValue={getEditEntry()} handleSave={handleEditEntry}></EditDocumentModal>}
      <ToastContainer />
    </Container>
  );
}
