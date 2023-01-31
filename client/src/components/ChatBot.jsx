import { useEffect, useState } from 'react';
import ChatBot from 'react-simple-chatbot'; 
import { ThemeProvider } from 'styled-components';
import {displayAvailableDates} from "../firebase";

function Chatbot() {
  const [result, setResult] = useState(null);
  const [resultRoutier, setResulRoutier] = useState(null);
  const [resultTtTerrain, setResultTtTerrain] = useState(null);
  const [resultPiste, setResultPiste] = useState(null);


  useEffect(() => {
    const getResult = async () => {
      const result = await displayAvailableDates("km");
      setResult(result)
    };
    const getResultRoutier = async () => {
      const resultRoutier = await displayAvailableDates("routier");
      setResulRoutier(resultRoutier)
    };
    const getResultTtTerrain = async () => {
      const resultRoutier = await displayAvailableDates("tout-terrain");
      setResultTtTerrain(resultRoutier)
    };
    const getResultPiste = async () => {
      const resultPiste = await displayAvailableDates("piste");
      setResultPiste(resultPiste)
    };
    
    getResult();
    getResultRoutier();
    getResultTtTerrain();
    getResultPiste();
  }, []);

  let opt = [
    { value: 1, label: 'Entretien véhicule', trigger: '4' },
    { value: 2, label: 'Informations sur les véhicules', trigger: '15' },
    { value: 3, label: 'Informations de contact', trigger: '20' },
    { value: 4, label: 'Stopper la discussion', trigger: '3' },
  ]

  // Chatbot steps

  const steps = [
  {
      id: '0',
      message: 'En quoi puis-je vous aider ?',
      trigger: '1',
  },  {
      id: '1',
      options: opt
  }, {
    id: '3',
    message: 'Merci pour votre visite.',
    end: true
  }, {
    id: '4',
    message: 'De quelle année date votre véhicule ?', 
    trigger: 5
  }, {
    id: '5',
    user: true,
    validator: (value) => {
      let currentYear = new Date().getFullYear();
      if (Number.isInteger(+value) && value.length === 4 && +value > 2000 && +value <= currentYear ){
        return true;
      }
      return 'Veuillez saisir une année valide ' ;
    },
    trigger: '6'
  },   {
    id: '6',
    message: 'Quelle est la date du dernier entretien de la moto ?',
    trigger: '7'
  }, {
    id: '7',
    user: true,
    validator: (value) => {
      let pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
      if (pattern.test(value) ) {
        return true;
      } 
      return 'Veuillez saisir une date valide ' ;
    },
    trigger:  ({ value, steps }) => {
      let input = new Date(Date.parse(value));
      let mainteanceYear = input.getFullYear();
      let currentYear = new Date().getFullYear();
      let previousValue = steps[5].value
      
      if (mainteanceYear - previousValue < 0) {
        return '10'
      } else if (currentYear - mainteanceYear > 1) {
        // Supérieur à 1 an
        return '21'
      } else if (currentYear - mainteanceYear <= 1) {
        // Inférieur
        return '9'
      }
    },
  }, {
    id: '8',
    options: result
    
  }, {
    // Step appelé si date entretien inférieure à 1 an
    id: '9',
    message: 'Quel est le nombre de kilomètres parcourus depuis le dernier entretien du véhicule ?',
    trigger: '11'
  }, {
    id: '10',
    message: "La date d'entretien ne peut pas être antérieure à celle du véhicule",
    trigger: '6'
  }, {
    id: '11',
    user: true,
    validator: (value) => {
      let valueNum = Number(value);
    
      if (!( typeof valueNum === "number" && valueNum > 0 && valueNum <= 2000000 )) {
        return 'Veuillez saisir un nombre de km valide ' ;
      }
      return true
    },
    trigger: ({ value }) => {
      
      if (value < 10000) {
        return '13';
      } else {
        return '8';
      }
    }
  }, {
    id: '12',
    message: "C'est noté ! Votre RDV a bien été pris en compte",
    
  }, {
    id: '13',
    message: 'Souhaitez-vous faire réviser votre véhicule ?',
    trigger: '14'
    
  }, {
    id: '14',
    options: [
      { value: 1, label: 'Oui', trigger: '8' },
      { value: 2, label: 'Non', end: true }
    ]
  }, {
    id: '15',
    message: "Quel est votre type d'usage ?",
    trigger: '16'
  }, {
    id: '16',
    options: [
      { value: 1, label: 'Usage routier', trigger: '17' },
      { value: 2, label: 'Usage tout-terrain', trigger: '18' },
      { value: 3, label: 'Usage sportif', trigger: '19' }
    ]
  }, {
    id: '17',
    options: resultRoutier
  }, {
    id: '18',
    options: resultTtTerrain
  }, {
    id: '19',
    options: resultPiste
  }, {
    id: '20',
    options: [
      { value: 1, label: 'Mail', end: true },
      { value: 2, label: 'Téléphone', end: true}
    ]
  }, {
    id: '21',
    message: "Veuillez choisir une date de RDV:",
    trigger: "8"
  }

];


  // Creating our theme
  const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#8A2BE2',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#8A2BE2',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };
  
  // Set some properties of the bot
  const config = {
    // botAvatar: {img},
    floating: true,
  };

  return result || resultRoutier || resultTtTerrain || resultPiste? (
    <ThemeProvider theme={theme}>
      <ChatBot
        headerTitle="GeekBot"
        steps={steps}
        {...config}
      />
    </ThemeProvider>
  ) : null;
  
}


export default Chatbot;
