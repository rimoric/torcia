import React, { useState } from 'react';

import PipeTConnector from './components/controls/PipeTConnector';
import ValveTwoWay from './components/controls/ValveTwoWay';
import ValveModulating from './components/controls/ValveModulating';
import NitrogenCompressor from './components/controls/NitrogenCompressor';
import GeneratorSet from './components/controls/GeneratorSet';
import NitrogenBottlePack from './components/controls/NitrogenBottlePack';
import LPGTank from './components/controls/LPGTank';
import FlareTorch from './components/controls/FlareTorch';
import NitrogenElbow from './components/controls/NitrogenElbow';
import NitrogenStraightPipe from './components/controls/NitrogenStraightPipe';

const SchemaImpianto = () => {
  // Stati dell'impianto
  const [flowStates, setFlowStates] = useState({
    leftBranch: true,
    rightBranch: true, 
    bottomBranch: true
  });
  
  const [valvePV1Open, setValvePV1Open] = useState(true);
  const [valvePV2Open, setValvePV2Open] = useState(false);
  const [valvePV4Open, setValvePV4Open] = useState(true);
  const [valvePV5Open, setValvePV5Open] = useState(false);
  const [valvePV6Open, setValvePV6Open] = useState(true);
  
  const [valvePR1Value, setValvePR1Value] = useState(50);
  const [valvePR2Value, setValvePR2Value] = useState(75);

  const [compressorNC1State, setCompressorNC1State] = useState('running');
  const [compressorNC1Pressure, setCompressorNC1Pressure] = useState(8.5);
  const [compressorNC1Temp, setCompressorNC1Temp] = useState(65);

  const [generatorGE1State, setGeneratorGE1State] = useState('stopped');

  const [bottlePackData, setBottlePackData] = useState([
    { pressure: 180, capacity: 50, enabled: true },
    { pressure: 120, capacity: 50, enabled: true },
    { pressure: 85, capacity: 50, enabled: false }
  ]);
  const [manifoldPressure, setManifoldPressure] = useState(125);

  const [tankTemperature, setTankTemperature] = useState(25);
  const [tankFillLevel, setTankFillLevel] = useState(75);

  const [torchState, setTorchState] = useState({
    isLit: false,
    pilotActive: true
  });

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="relative w-[800px] h-[600px]">
        
        {/* Connettore a T sinistra per PR2 */}
        <div className="absolute" style={{ left: '335px', top: '395px' }}>
          <PipeTConnector
            x={0}
            y={0}
            orientation="top"
            flowStates={{
              main1: true,
              main2: true,
              branch: valvePV2Open
            }}
            label=""
            showFlange={false}
            size={0.5}
            pipeLength={100}
          />
        </div>

        {/* Valvola PV2 sopra il connettore T sinistra */}
        <div className="absolute" style={{ left: '50px', top: '40px' }}>
          <ValveTwoWay
            isOpen={valvePV2Open}
            label="PV2"
            orientation="vertical"
            manualControlEnabled={false}
            onToggle={() => setValvePV2Open(!valvePV2Open)}
          />
        </div>

        {/* Connettore a T centrale */}
        <div className="absolute" style={{ left: '335px', top: '135px' }}>
          <PipeTConnector
            x={0}
            y={0}
            orientation="bottom"
            flowStates={{
              main1: flowStates.leftBranch,  
              main2: flowStates.rightBranch, 
              branch: flowStates.bottomBranch 
            }}
            label=""
            showFlange={false}
            size={0.5}
            pipeLength={100}
          />
        </div>

        {/* Valvola PV1 sull'uscita destra del connettore */}
        <div className="absolute" style={{ left: '430px', top: '164px' }}>
          <ValveTwoWay
            isOpen={valvePV1Open}
            label="PV1"
            orientation="horizontal"
		    flowDirection="left"
            manualControlEnabled={false}
            onToggle={() => setValvePV1Open(!valvePV1Open)}
          />
        </div>

        {/* Valvola Modulante PR2 */}
		<div className="absolute" style={{ left: '251px', top: '154px' }}>
			<ValveModulating
				value={valvePR2Value}
				label="PR2"
				orientation="horizontal"
				manualControlEnabled={false}
				onChange={setValvePR2Value}
			/>
		</div>

		{/* Valvola PV4 - verticale con flusso alto -> basso */}
		<div className="absolute" style={{ left: '365px', top: '330px' }}>
		  <ValveTwoWay
		    isOpen={valvePV4Open}
		    label="PV4"
		    orientation="vertical"
		    flowDirection="down"
		    manualControlEnabled={false}
		    onToggle={() => setValvePV4Open(!valvePV4Open)}
		  />
		</div>

		{/* Valvola Modulante PR1 - verticale con flusso verso il basso */}
		<div className="absolute" style={{ left: '353px', top: '220px' }}>
			<ValveModulating
				value={valvePR1Value}
				label="PR1"
				orientation="vertical"
				manualControlEnabled={false}
				onChange={setValvePR1Value}
			/>
		</div>

		{/* Valvola PV5 - orizzontale con flusso dx -> sx */}
		<div className="absolute" style={{ left: '270px', top: '425px' }}>
		  <ValveTwoWay
		    isOpen={valvePV5Open}
		    label="PV5"
		    orientation="horizontal"
		    flowDirection="leftt"
		    manualControlEnabled={false}
		    onToggle={() => setValvePV5Open(!valvePV5Open)}
		  />
		</div>

		{/* Valvola PV6 - orizzontale con flusso sx -> dx */}
		<div className="absolute" style={{ left: '430px', top: '425px' }}>
		  <ValveTwoWay
		    isOpen={valvePV6Open}
		    label="PV6"
		    orientation="horizontal"
		    flowDirection="right"
		    manualControlEnabled={false}
		    onToggle={() => setValvePV6Open(!valvePV6Open)}
		  />
		</div>

		{/* Compressore Azoto NC1 */}
		<div className="absolute" style={{ left: '515px', top: '-95px' }}>
		  <NitrogenCompressor
		    state={compressorNC1State}
		    pressure={compressorNC1Pressure}
		    temperature={compressorNC1Temp}
		    label="NC1"
		    pipeExitSide="bottom"
		    manualControlEnabled={true}
		    onStart={() => {
		      setCompressorNC1State('running');
		      setCompressorNC1Pressure(8.5);
		      setCompressorNC1Temp(65);
		    }}
		    onStop={() => {
		      setCompressorNC1State('stopped');
		      setCompressorNC1Pressure(0);
		      setCompressorNC1Temp(25);
		    }}
		    size={0.8}
		  />
		</div>

		{/* Gruppo Elettrogeno GE1 */}
		<div className="absolute" style={{ left: '380px', top: '-60px' }}>
		  <GeneratorSet
		    state={generatorGE1State}
		    label="GE1"
		    manualControlEnabled={true}
		    onStart={() => setGeneratorGE1State('running')}
		    onStop={() => setGeneratorGE1State('stopped')}
		    size={1}
		  />
		</div>

		{/* Pacco Bombole Azoto N2-1 */}
		<div className="absolute" style={{ left: '10px', top: '-130px' }}>
		  <NitrogenBottlePack
		    bottles={bottlePackData}
		    manifoldPressure={manifoldPressure}
		    label="N2-1"
		    orientation="vertical-inverted"
		    size={0.8}
		  />
		</div>

		{/* Serbatoio GPL TK1 */}
		<div className="absolute" style={{ left: '20px', top: '355px' }}>
		  <LPGTank
		    temperature={tankTemperature}
		    fillLevel={tankFillLevel}
		    label="TK1"
		    orientation="vertical"
		    size={0.6}
		  />
		</div>

		{/* Torcia GPL FT1 - posizionata sopra il serbatoio ma a sinistra */}
		<div className="absolute" style={{ left: '570px', top: '380px' }}>
		  <FlareTorch
		    isLit={torchState.isLit}
		    label="FT1"
		    orientation="vertical"
		    manualControlEnabled={true}
		    onToggle={() => setTorchState(prev => ({
		      ...prev, 
		      isLit: !prev.isLit
		    }))}
		    size={0.7}
		  />
		</div>

		{/* Curva alto-sinistra sopra il sistema */}
		<div className="absolute" style={{ left: '570px', top: '155px' }}>
		  <NitrogenElbow
		    direction="bottom-left"
		    hasFlow={true}
		    size={0.5}
		  />
		</div>

		{/* Curva alto-destra a destra del sistema */}
		<div className="absolute" style={{ left: '100px', top: '155px' }}>
		  <NitrogenElbow
		    direction="bottom-right"
		    hasFlow={true}
		    size={0.5}
 		    // diameter={25}
		    // radius={45}
		  />
		</div>

		{/* Tubo orizzontale sx */}
		<div className="absolute" style={{ left: '125px', top: '195px' }}>
		  <NitrogenStraightPipe
		    orientation="horizontal"
		    hasFlow={true}
		    size={0.5}
		    length={310}
		  />
		</div>

		{/* Tubo orizzontale dx */}
		<div className="absolute" style={{ left: '510px', top: '195px' }}>
		  <NitrogenStraightPipe
		    orientation="horizontal"
		    hasFlow={true}
		    size={0.5}
		    length={170}
		  />
		</div>

		{/* Tubo orizzontale sx */}
		<div className="absolute" style={{ left: '125px', top: '455px' }}>
		  <NitrogenStraightPipe
		    orientation="horizontal"
		    hasFlow={true}
		    size={0.5}
		    length={327}
		  />
		</div>

		{/* Tubo orizzontale dx */}
		<div className="absolute" style={{ left: '510px', top: '455px' }}>
		  <NitrogenStraightPipe
		    orientation="horizontal"
		    hasFlow={true}
		    size={0.5}
		    length={157}
		  />
		</div>

		{/* Tubo verticale sx */}
		<div className="absolute" style={{ left: '100px', top: '110px' }}>
		  <NitrogenStraightPipe
		    orientation="vertical"
		    hasFlow={true}
		    size={0.5}
		    length={140}
		  />
		</div>

		{/* Tubo verticale dx */}
		<div className="absolute" style={{ left: '610px', top: '58px' }}>
		  <NitrogenStraightPipe
		    orientation="vertical"
		    hasFlow={true}
		    size={0.5}
		    length={243}
		  />
		</div>

		{/* Tubo verticale cx */}
		<div className="absolute" style={{ left: '394px', top: '320px' }}>
		  <NitrogenStraightPipe
		    orientation="vertical"
		    hasFlow={true}
		    size={0.5}
		    length={40}
		  />
		</div>


      </div>
    </div>
  );
};

export default SchemaImpianto;
