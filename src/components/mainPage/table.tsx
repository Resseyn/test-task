import { TableData } from "@/types/types";
import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

type AnchorPosition = { top: number; left: number } | null;

export default function DocumentTable({ data, onDelete, onEdit }: 
  { data: TableData[], onDelete: (id: string) => void, onEdit: (id: string) => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchorPosition, setMenuAnchorPosition] = useState<AnchorPosition | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleContextMenu = (event: React.MouseEvent, id: string) => {
    setMenuAnchorPosition({ top: event.clientY, left: event.clientX });
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="documents table">
          <TableHead>
            <TableRow>
              <TableCell className="w-24">Название</TableCell>
              <TableCell className="w-24">Тип</TableCell>
              <TableCell className="w-24">Статус</TableCell>
              <TableCell className="w-24">Номер работника</TableCell>
              <TableCell className="w-24">Подпись работника</TableCell>
              <TableCell className="w-24">Подпись компании</TableCell>
              <TableCell className="w-24">Дата подписания работника</TableCell>
              <TableCell className="w-24">Дата подписания компании</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((doc: TableData) => (
              <TableRow key={doc.id} 
              onClick={(event) => handleContextMenu(event, doc.id)}>
                <TableCell>{doc.documentName}</TableCell>
                <TableCell>{doc.documentType}</TableCell>
                <TableCell className={`${doc.documentStatus === "Подписан" ? "text-green-500" : "text-red-500"}`}>
                  {doc.documentStatus}
                </TableCell>
                <TableCell>{doc.employeeNumber}</TableCell>
                <TableCell>{doc.employeeSignatureName}</TableCell>
                <TableCell>{doc.companySignatureName}</TableCell>
                <TableCell>{new Date(doc.employeeSigDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(doc.companySigDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={menuAnchorPosition}
      >
      <MenuItem onClick={() => {
        onEdit(selectedId)
        setAnchorEl(null)
        }}>Изменить</MenuItem>
      <MenuItem className="transition bg-red-300/35 hover:bg-red-300" 
        onClick={() => {
          onDelete(selectedId)
          setAnchorEl(null)
        }}>
          Удалить
      </MenuItem>
    </Menu>
    </>
  );
}
