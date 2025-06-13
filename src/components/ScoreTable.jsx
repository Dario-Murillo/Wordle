/* components/ScoreTable.jsx */

'use client';

import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from './TableComponents';
import createClient from '../utils/supabase/client';

const ITEMS_PER_PAGE = 10;

export default function ScoreTable({ user }) {
  const [scores, setScores] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from('Registros')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha', { ascending: true });
      if (!error) setScores(data || []);
      else setScores([]);
    };
    fetchScores();
  }, [user]);

  const filteredData = useMemo(() => {
    return scores.filter(
      (item) =>
        item.palabra.toLowerCase().includes(search.toLowerCase()) ||
        item.fecha.includes(search),
    );
  }, [search, scores]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-4">Tabla de Puntos</h2>

      <Input
        type="text"
        placeholder="Buscar por palabra o fecha..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="mb-4 w-full max-w-md text-black"
      />

      <div className="overflow-x-auto">
        <Table className="w-full text-white">
          <TableHeader>
            <TableRow>
              <TableCell className="font-bold">Palabra</TableCell>
              <TableCell className="font-bold">Adivinada</TableCell>
              <TableCell className="font-bold">Número de Intentos</TableCell>
              <TableCell className="font-bold">Fecha</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.palabra}</TableCell>
                <TableCell>{item.adivinada ? 'Sí' : 'No'}</TableCell>
                <TableCell>{item.intentos}</TableCell>
                <TableCell>{item.fecha}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <span className="flex text-white px-2 items-center justify-items-center">
          {page} / {totalPages}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

ScoreTable.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};
