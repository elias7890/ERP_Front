import axios from 'axios';

const API_URL = 'https://mindicador.cl/api';

export const fetchIndicators = async () => {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        const formattedData = [
            {
                id: 1,
                //img: "https://images.pexels.com/photos/8405873/pexels-photo-8405873.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                username: data.uf.nombre,
                amount: data.uf.valor.toLocaleString("es-CL"),
            },
            {
                id: 2,
               // img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
                username: data.dolar.nombre,
                amount: data.dolar.valor.toLocaleString("es-CL"),
            },
            {
                id: 3,
               // img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
                username: data.euro.nombre,
                amount: data.euro.valor.toLocaleString("es-CL"),
            },
        ];

        return formattedData;
    } catch (error) {
        console.error('Error al obtener los indicadores:', error);
        throw error;
    }
};