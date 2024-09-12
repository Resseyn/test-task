import * as React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from "@mui/material";

export function SkeletonTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="skeleton table">
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
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="rectangular" height={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" height={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" height={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" height={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" height={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" height={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" height={30} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" height={30} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
