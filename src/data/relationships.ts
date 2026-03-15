import type { SupplyRelationship } from './types';

export const relationships: SupplyRelationship[] = [
  // === MOTOR SUPPLIERS → OEMs ===
  { id: 'r1', from: 'maxon', to: 'boston_dynamics', component: 'BLDC Motors', description: 'Precision frameless motors' },
  { id: 'r2', from: 'maxon', to: 'apptronik', component: 'BLDC Motors', description: 'Frameless BLDC motors for Apollo' },
  { id: 'r3', from: 'kollmorgen', to: 'figure', component: 'BLDC Motors', description: 'Frameless BLDC motors' },
  { id: 'r4', from: 'kollmorgen', to: 'agility', component: 'BLDC Motors', description: 'Brushless DC motors' },
  { id: 'r5', from: 'cubemars', to: 'unitree', component: 'BLDC Motors', description: 'Actuator motors' },
  { id: 'r6', from: 'nidec', to: 'tesla', component: 'Motors', description: 'Frameless and coreless motors' },
  { id: 'r7', from: 'estun', to: 'agibot', component: 'Servo Motors', description: 'Servo actuators' },

  // === REDUCER SUPPLIERS → OEMs ===
  { id: 'r10', from: 'harmonic_drive', to: 'tesla', component: 'Harmonic Reducer', bomPercent: 36, description: '~36% of rotary actuator cost' },
  { id: 'r11', from: 'harmonic_drive', to: 'apptronik', component: 'Harmonic Reducer', bomPercent: 36 },
  { id: 'r12', from: 'harmonic_drive', to: 'figure', component: 'Harmonic Reducer', bomPercent: 36 },
  { id: 'r13', from: 'harmonic_drive', to: 'unitree', component: 'Harmonic Reducer' },
  { id: 'r14', from: 'harmonic_drive', to: 'ubtech', component: 'Harmonic Reducer' },
  { id: 'r15', from: 'harmonic_drive', to: 'dexmate', component: 'Harmonic Reducer' },
  { id: 'r16', from: 'harmonic_drive', to: 'engineai', component: 'Strain Wave Reducer' },

  // === COMPUTE SUPPLIERS → OEMs ===
  { id: 'r20', from: 'nvidia', to: 'agility', component: 'Jetson Platform', description: 'AI partnership + compute' },
  { id: 'r21', from: 'nvidia', to: '1x', component: 'Jetson Thor', description: 'NEO Cortex compute' },
  { id: 'r22', from: 'nvidia', to: 'boston_dynamics', component: 'Jetson AGX Thor' },
  { id: 'r23', from: 'nvidia', to: 'dexmate', component: 'Jetson AGX Thor' },
  { id: 'r24', from: 'nvidia', to: 'unitree', component: 'Jetson Orin' },
  { id: 'r25', from: 'nvidia', to: 'agibot', component: 'Jetson Orin 64G' },
  { id: 'r26', from: 'nvidia', to: 'figure', component: 'Dual NVIDIA GPUs' },
  { id: 'r27', from: 'nvidia', to: 'engineai', component: 'Jetson Thor' },
  { id: 'r28', from: 'intel', to: 'agility', component: 'i7 CPUs + RealSense', description: 'Dual i7 CPUs and depth cameras' },
  { id: 'r29', from: 'intel', to: 'dexmate', component: 'x86 SoC', description: 'Secondary compute' },
  { id: 'r30', from: 'intel', to: 'engineai', component: 'Intel N97' },
  { id: 'r31', from: 'horizon_robotics', to: 'xpeng', component: 'AI Chips', description: 'Chinese compute alternative' },

  // === AI PARTNERS → OEMs ===
  { id: 'r40', from: 'google_deepmind', to: 'apptronik', component: 'AI/ML Models', description: 'Foundation model partnership' },
  { id: 'r41', from: 'google_deepmind', to: 'boston_dynamics', component: 'AI/ML Models', description: 'Robot learning models' },

  // === SENSOR SUPPLIERS → OEMs ===
  { id: 'r50', from: 'hesai', to: 'unitree', component: 'LiDAR', description: '3D LiDAR sensors' },
  { id: 'r51', from: 'hesai', to: 'agibot', component: 'LiDAR' },
  { id: 'r52', from: 'hesai', to: 'xpeng', component: 'LiDAR' },
  { id: 'r53', from: 'sony_sensors', to: 'tesla', component: 'Image Sensors', description: 'Camera sensors (FSD hardware)' },
  { id: 'r54', from: 'sony_sensors', to: 'figure', component: 'Image Sensors' },

  // === SEMICONDUCTOR SUPPLY CHAIN ===
  { id: 'r60', from: 'tsmc', to: 'nvidia', component: 'Chip Fabrication', description: 'Fabricates Jetson/GPU chips' },
  { id: 'r61', from: 'tsmc', to: 'intel', component: 'Chip Fabrication' },
  { id: 'r62', from: 'texas_instruments', to: 'tesla', component: 'Motor Drivers / Power ICs' },
  { id: 'r63', from: 'texas_instruments', to: 'apptronik', component: 'Analog ICs' },
  { id: 'r64', from: 'infineon', to: 'tesla', component: 'Power Semiconductors', description: 'Motor controllers, power management' },
  { id: 'r65', from: 'infineon', to: 'boston_dynamics', component: 'Power Semiconductors' },
  { id: 'r66', from: 'samsung_electro', to: 'tesla', component: 'MLCCs / Substrates' },
  { id: 'r67', from: 'samsung_electro', to: 'unitree', component: 'Passive Components' },

  // === RAW MATERIALS → COMPONENT MAKERS ===
  { id: 'r70', from: 'mp_materials', to: 'maxon', component: 'NdFeB Rare Earths', description: 'Magnet materials for BLDC motors' },
  { id: 'r71', from: 'mp_materials', to: 'kollmorgen', component: 'NdFeB Rare Earths' },
  { id: 'r72', from: 'mp_materials', to: 'nidec', component: 'NdFeB Rare Earths' },
  { id: 'r73', from: 'lynas', to: 'maxon', component: 'Rare Earth Oxides' },
  { id: 'r74', from: 'lynas', to: 'nidec', component: 'Rare Earth Oxides' },
  { id: 'r75', from: 'jl_mag', to: 'cubemars', component: 'NdFeB Magnets', description: 'Permanent magnets for Chinese motor supply chain' },
  { id: 'r76', from: 'jl_mag', to: 'estun', component: 'NdFeB Magnets' },

  // === END EFFECTOR SUPPLIERS ===
  { id: 'r80', from: 'psyonic', to: 'apptronik', component: 'Dexterous Hands', description: 'Off-the-shelf robotic/prosthetic hands' },
];
