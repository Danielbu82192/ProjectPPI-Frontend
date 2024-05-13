import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExcelUploader = ({ onUpload }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const headers = jsonData[3];
        const docIndex = headers.indexOf('DOCUMENTO');
        const nombreIndex = headers.indexOf('NOMBRES');
        const correoIndex = headers.indexOf('CORREOS');
        const codigo = sheet.B2.v;
        const documentoProfesor = sheet.B1.v;
        const grupoAsignatura = sheet.B3.v;

        const extractedData = jsonData.slice(4).map(row => ({
          documento: row[docIndex],
          nombre: row[nombreIndex],
          correo: row[correoIndex]
        }));

        const fileData = { codigo, documentoProfesor, grupoAsignatura, datos: extractedData };

        // Guardar los datos extraídos en el estado
        setUploadedFiles(prevFiles => [...prevFiles, fileData]);

        // Enviar los datos al backend
        axios.post('https://td-g-production.up.railway.app/usuario/LoadStudents', fileData)
          .then(response => {
            console.log('Datos enviados al backend:', response.data);
          })
          .catch(error => {
            console.error('Error al enviar datos al backend:', error);
          });
      };
      
      reader.readAsArrayBuffer(file);
    });

    // Llamar a la función onUpload pasada como prop
    onUpload();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Suelta los archivos aquí...</p> :
            <p>Haz clic aquí para seleccionar los archivos extraídos del Polidinámico con los estudiantes.</p>
        }
      </div>
      {uploadedFiles.length > 0 && (
        <div>
          <br></br><h2>Los estudiantes de las siguientes asignaturas han sido seleccionados correctamente:</h2>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                <strong>Código de Asignatura:</strong> {file.codigo}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
