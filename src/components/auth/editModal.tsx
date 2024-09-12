import { Modal, Box, Typography, Button, TextField, IconButton, Input } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { TableData } from "@/types/types";
import { v4 as uuidv4 } from "uuid";
import { formatDateTimeForInput } from "@/utils/helpers";

uuidv4();

interface NewDocumentModalProps {
  open: boolean;
  defaultValue: TableData,
  handleClose: () => void;
  handleSave: (data: TableData) => void;
}

const labels = {
  documentName: "Название",
  documentType: "Тип",
  documentStatus: "Статус",
  employeeNumber: "Номер работника",
  employeeSignatureName: "Подпись работнкиа",
  companySignatureName: "Подпись компании",
};

export default function EditDocumentModal({ open, defaultValue, handleClose, handleSave }: NewDocumentModalProps) {
  if (defaultValue.employeeSigDate) defaultValue.employeeSigDate = formatDateTimeForInput(defaultValue.employeeSigDate);
  if (defaultValue.companySigDate) defaultValue.companySigDate = formatDateTimeForInput(defaultValue.companySigDate);

  const [documentData, setDocumentData] = useState<TableData>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDocumentData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    handleSave(documentData);
    handleClose();
    setDocumentData({
      id: uuidv4(),
      documentName: "",
      documentType: "",
      documentStatus: "",
      employeeNumber: "",
      employeeSignatureName: "",
      companySignatureName: "",
      employeeSigDate: "",
      companySigDate: "",
    });
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-xl p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 id="modal-title" className="text-xl font-semibold">
              Изменить документ
            </h2>
            <Button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <CloseIcon />
            </Button>
          </div>
          <p id="modal-description" className="mb-4 text-gray-600">
            Заполните поля для изменения
          </p>

          {Object.keys(documentData)
            .filter((key) => key !== "id")
            .map((key) => (
              <div key={key} className="mb-4">
                <Input
                  type={key.includes("Date") ? "datetime-local" : "text"}
                  name={key}
                  placeholder={labels[key]}
                  value={documentData[key]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
            ))}

          <div className="flex justify-between mt-4">
            <Button onClick={handleClose} className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Отмена
            </Button>
            <Button onClick={handleSubmit}>Сохранить</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
