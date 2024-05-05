// En tu componente CargaExcel
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import axios from 'axios';

const CargaExcel = ({ onClick }) => {
  const [fileData, setFileData] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Encabezados de las columnas
      const headers = jsonData[0];

      // Extraer los datos de las columnas y crear un objeto de datos
      const extractedData = jsonData.slice(1).map(row => {
        let codigos = [];
        if (row[5]) {
          if (row[5].includes(',')) {
            codigos = row[5].split(',').map(codigo => codigo.trim());
          } else {
            codigos.push(row[5].trim());
          }
        }
        return {
          documento: row[0],
          nombre: row[1],
          correo: row[2],
          rol: row[3],
          programa: row[4],
          codigos: codigos
        };
      });      

      // Guardar los datos extraídos en el estado
      setFileData(extractedData);

      // Enviar los datos al backend
      axios.post('https://td-g-production.up.railway.app/usuario/LoadSOL', extractedData)
        .then(response => {
          console.log('Datos enviados al backend:', response.data);
        })
        .catch(error => {
          console.error('Error al enviar datos al backend:', error);
        });
      
      // Llamar a la función onClick pasada como prop
      onClick();
    };

    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Suelta el archivo aquí...</p> :
            <p>Haz click aquí para seleccionar el archivo que contiene los docentes y asesores.</p>
        }
      </div>
      {fileData && (
        <div>
          <br></br><h2>Archivo seleccionado correctamente.</h2>
        </div>
      )}
    </div>
  );
};

export default CargaExcel;
