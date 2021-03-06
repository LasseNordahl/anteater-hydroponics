import React, { useState, useEffect } from "react";
import './Home.scss';

import moment from 'moment';
import { DatePicker, Modal } from 'react-rainbow-components';
import Particles from 'react-particles-js';
import axios from "axios";
import particlesParams from 'globals/particles-config.js';
import ahp_logo_dark from './../../assets/ahp_logo.png';
import ahp_logo_light from './../../assets/ahp_logo_light.png';
import ThemeContext from 'app/context/ThemeContext';
import { useToasts } from 'react-toast-notifications';

import {
  PlantInfo,
  DataCard,
  ExpandedDataView
} from 'app/components';

import {
  SettingsView,
  HealthView
} from 'app/views';

const dataCards = [
  {
    title: "Light Sensor",
    endpoint: "light",
    color: {
      r: 255,
      g: 155,
      b: 41
    }
  },
  {
    title: "Humidity Sensor",
    endpoint: "humidity",
    color: {
      r: 109,
      g: 222,
      b: 216
    }
  },
  {
    title: "Water Levels",
    endpoint: "water",
    color: {
      r: 77,
      g: 120,
      b: 240
    }
  },
  {
    title: "Temperature Sensor",
    endpoint: "temperature",
    color: {
      r: 242,
      g: 70,
      b: 70
    }
  }
]


function Home(props) {

  const { addToast } = useToasts();

  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [healthPanelOpen, setHealthPanelOpen] = useState(false);
  const [dataPanelOpen, setDataPanelOpen] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [plant, setPlant] = useState(null);
  const [fromDate, setFromDate] = useState(moment().subtract(10, 'd').toDate());
  const [toDate, setToDate] = useState(moment().add(1, 'd').toDate());

  useEffect(() => {
    let plantId = + props.match.params.plantId;
    getPlant(plantId);

    // Interval for updating the date ranges to pull from
    // let interval = setInterval(() => {
    //   if (!fromDateChanged) {
    //     setFromDate(moment().subtract(7, 'd').toDate())
    //   }
    //   if (!toDateChanged) {
    //     setToDate(moment().toDate())
    //   }
    // }, 5000);

    // return () => clearInterval(interval);
  }, [props.match.params.plantId]);

  function getPlant(plantId) {
    axios.get('/api/plant/' + plantId) 
    .then(function (response){
      setPlant(response.data);
    })
    .catch(function (error){
      console.log(error);
      addToast('Unable to pull plant info', { appearance: 'error' });
    });
  }

  function openDataPanel(title, endpoint, plant, color) {
    // console.log('P5555', endpoint);
    setSelectedPanel({
      title: title,
      endpoint: endpoint,
      plant: plant,
      color: color
    });
    setDataPanelOpen(true);
  }

  function closeSettingsPanel() {
    setSettingsPanelOpen(false);
    getPlant(props.match.params.plantId);
  }

  return (
    <ThemeContext.Consumer>
      {value => (
        <div className="Home">
        <div className="home-particles-container">
          <Particles 
            className="home-particles" 
            style={{
              'width': '100%',
              'height': '100%'
            }} 
            params={particlesParams}
          />
        </div>
        <div className="home-layout">
          <div className="home-header"> 
            { !value.darkmode ? <img src={ahp_logo_dark}></img> : <img src={ahp_logo_light}></img>}
            <div>
              <h1>
                Anteater Hydroponics
              </h1>
              <p>
                IoT Project by Lasse Nordahl and Jesse Chong
              </p>
            </div>
          </div>
          <div className="home-animated-tree flex-center">
            <PlantInfo 
              plant={plant}
              setSettingsPanelOpen={setSettingsPanelOpen}
              setHealthPanelOpen={setHealthPanelOpen}
              fromDate={moment(fromDate).format("YYYY-MM-DD HH:mm:ss")}
              toDate={moment(toDate).format("YYYY-MM-DD HH:mm:ss")}
            ></PlantInfo>
          </div>
          <div className={"home-filtering flex-center " + (value.darkmode ? "home-filtering-darkmode" : null)}>
            <DatePicker
              label="From"
              value={fromDate}
              onChange={(value) => setFromDate(value)}
            >
            </DatePicker>
            <DatePicker
              label="To"
              value={toDate}
              onChange={(value) => setToDate(value)}
            >
            </DatePicker>
          </div>
          <div className="home-card-layout">
            {dataCards.map(function(dataCard, index) {
              return (
                <div key={index}>
                  <DataCard 
                    plant={plant}
                    title={dataCard.title} 
                    endpoint={dataCard.endpoint}
                    color={dataCard.color}
                    fromDate={moment(fromDate).format("YYYY-MM-DD HH:mm:ss")}
                    toDate={moment(toDate).format("YYYY-MM-DD HH:mm:ss")}
                    onClick={() => openDataPanel(dataCard.title, dataCard.endpoint, plant, dataCard.color)}
                  ></DataCard>
                </div>
              );
            })}
          </div>
        </div>
        { plant !== null ? 
          <Modal
            size="large"
            title="Anteater Hydroponics Settings"
            isOpen={settingsPanelOpen}
            onRequestClose={closeSettingsPanel}  
            style={{'maxHeight': '85vh'}} 
            className={"dialog " + (value.darkmode ? "dialog-darkmode": null)}
          >
            <SettingsView 
              plant={{...plant}} 
              darkmode={value.darkmode} 
              onRequestClose={closeSettingsPanel}/>
          </Modal>
          : null
        }
        { plant !== null ? 
          <Modal
            size="large"
            title="Plant Health"
            isOpen={healthPanelOpen}
            onRequestClose={() => setHealthPanelOpen(false)}  
            style={{'maxHeight': '85vh'}} 
            className={"dialog " + (value.darkmode ? "dialog-darkmode": null)}
          >
            <HealthView 
              plant={plant} 
              onRequestClose={() => setHealthPanelOpen(false)}
              currentFromDate={moment(fromDate).format("YYYY-MM-DD HH:mm:ss")}
              currentToDate={moment(toDate).format("YYYY-MM-DD HH:mm:ss")}
              prevFromDate={moment(fromDate).format("YYYY-MM-DD HH:mm:ss")}
              prevToDate={moment(toDate).format("YYYY-MM-DD HH:mm:ss")}
            />
          </Modal>
          : null
        }
        { selectedPanel !== null ?
          <Modal
           size="large"
           title={selectedPanel.title + ' Detailed View'}
           isOpen={dataPanelOpen}
           onRequestClose={() => setDataPanelOpen(false)}  
           className={"dialog " + (value.darkmode ? "dialog-darkmode": null)} 
          >
            <ExpandedDataView
              plant={selectedPanel.plant}
              endpoint={selectedPanel.endpoint}
              color={selectedPanel.color}
            />
          </Modal>
          : null
        }
       </div>
      )}
    </ThemeContext.Consumer>
  );
}

export default Home;
