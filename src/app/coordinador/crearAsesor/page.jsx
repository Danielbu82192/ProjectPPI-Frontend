"use client";
import React, { useEffect, useState } from 'react';
import './Page.css';
//import Dialog from '@mui/material/Dialog';

const API_ENDPOINT = "https://td-g-production.up.railway.app";

const updateAsesors = async (asesores) => {
  const response = await fetch(`${API_ENDPOINT}/usuario/updateUsers`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(asesores)
  });
  return response.json();
}

const addAsesors = async (asesors) => {
  const response = await fetch(`${API_ENDPOINT}/usuario/addUsers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(asesors)
  });
  return response.json();
}

const Page = () => {
  const [asesores, setAsesores] = useState(Array(15).fill({ Usuario_ID: "", Usuario_Nombre: "", Rol_ID: "", Usuario_Documento: "", Usuario_Correo: "" }));
  const [traidosDeBD, setTraidosDeBD] = useState([]); // Almacenar los datos originales
  const apiEndpoint = "https://td-g-production.up.railway.app/usuario/GetAsesor";
  const getAllUsers = "https://td-g-production.up.railway.app/usuario";

  useEffect(() => {
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        const fetchedData = data.slice(0, 15);
        const filledData = fetchedData.concat(Array(15 - fetchedData.length).fill({ Usuario_ID: "", Usuario_Nombre: "", Rol_ID: "", Usuario_Documento: "", Usuario_Correo: "" }));
        setAsesores(filledData);
        // Almacenar los datos originales
        setTraidosDeBD(fetchedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedAsesores = [...asesores];
    updatedAsesores[index] = { ...updatedAsesores[index], [field]: value || null };

    /* Si asesor.Usuario_Documento === null || asesor.Usuario_Nombre === null || asesor.Usuario_Correo === null, volver Usuario_ID: "", Usuario_Nombre: "", Rol_ID: "", Usuario_Documento: "", Usuario_Correo: "" */
    if (updatedAsesores[index].Usuario_Documento === null && updatedAsesores[index].Usuario_Nombre === null && updatedAsesores[index].Usuario_Correo === null) {
      updatedAsesores[index] = { Usuario_ID: "", Usuario_Nombre: "", Rol_ID: "", Usuario_Documento: "", Usuario_Correo: "" };
    }
    setAsesores(updatedAsesores);
  };

  const handleSave = () => {
    // Identficar registros modificados, para eso, si el asesor tiene Usuario_ID !== "", se comparan los datos originales con los actuales
    const asesoresModificados = asesores.filter((asesor) => {
      if (asesor.Usuario_ID !== "") {
        const asesorOriginal = traidosDeBD.find((asesorOriginal) => asesorOriginal.Usuario_ID === asesor.Usuario_ID);
        return asesor.Usuario_Documento !== asesorOriginal.Usuario_Documento || asesor.Usuario_Nombre !== asesorOriginal.Usuario_Nombre || asesor.Usuario_Correo !== asesorOriginal.Usuario_Correo;
      }
      return true;
    });

    console.log('asesoresModificados: ', asesoresModificados.filter(asesor => asesor.Usuario_ID !== "" && (asesor.Usuario_Documento !== null || asesor.Usuario_Nombre !== null || asesor.Usuario_Correo !== null)));

    // Identificar registros nuevos
    const asesoresNuevos = asesores.filter(asesor => asesor.Usuario_ID === "" && asesor.Usuario_Documento && asesor.Usuario_Nombre && asesor.Usuario_Correo);

    console.log('asesoresNuevos: ', asesoresNuevos);

    const allRecords = [...asesoresModificados, ...asesoresNuevos];
    const asesoresEliminados = traidosDeBD.filter(asesor => !allRecords.some(record => record.Usuario_ID === asesor.Usuario_ID));

    asesoresEliminados.forEach(asesor => {
      if (asesor.Rol_ID === 5) {
        asesor.Rol_ID = 2;
      } else if (asesor.Rol_ID === 3) {
        asesor.Rol_ID = 6;
      }
    });

    console.log('asesoresEliminados: ', asesoresEliminados);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Asesores PPI</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b border-gray-200 bg-green-500">Cédula</th>
            <th className="py-1 px-2 border-b border-gray-200 bg-green-500">Nombre</th>
            <th className="py-1 px-2 border-b border-gray-200 bg-green-500">Correo</th>
          </tr>
        </thead>
        <tbody>
          {asesores.map((asesor, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-0 px-0 border-b border-gray-200">
                <input
                  type="text"
                  value={asesor.Usuario_Documento || ''}
                  onChange={(e) => handleInputChange(index, 'Usuario_Documento', e.target.value)}
                  className="w-full p-0 border-b border-gray-200"
                />
              </td>
              <td className="py-0 px-0 border-b border-gray-200" style={{ width: "35%" }}>
                <input
                  type="text"
                  value={asesor.Usuario_Nombre || ''}
                  onChange={(e) => handleInputChange(index, 'Usuario_Nombre', e.target.value)}
                  className="w-full p-0 border-b border-gray-200"
                />
              </td>
              <td className="py-0 px-0 border-b border-gray-200" style={{ width: "45%" }}>
                <input
                  type="email"
                  value={asesor.Usuario_Correo || ''}
                  onChange={(e) => handleInputChange(index, 'Usuario_Correo', e.target.value)}
                  className="w-full p-0 border-b border-gray-200"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-700">Guardar Cambios</button>
    </div>
  );
};

export default Page;
