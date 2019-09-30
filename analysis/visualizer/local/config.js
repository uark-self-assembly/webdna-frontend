
/*
This file is part of HTMoL:
Copyright (C) 2014 Dr. Mauricio Carrillo-Tripp  
http://tripplab.com

Developers:
v1.0 Leonardo Alvarez-Rivera, Francisco Javier Becerra-Toledo, Adan Vega-Ramirez 
v2.0 Javier Garcia-Vieyra
v3.0 Omar Israel Lara-Ramirez, Eduardo González-Zavala, Emmanuel Quijas-Valades, Julio Cesar González-Vázquez
v3.5 Leonardo Alvarez-Rivera
*/

// ======================================= HTMoL ========================================== //
// =================================== tripplab.com ======================================= // 
// =============================== User defined variables ================================= //

// [MRS] This line is necessary, otherwise the variable won't be set when imported into the worker.js script
var PROJECT_ID = PROJECT_ID;

// Binary Server information
var WebIP="localhost"; // Server Name or IP. Use 'localhost' for testing
var WebPort="2020"; // Define internet port for communication, other than 80 (reserved for Apache)

var PDBDIR="pdbfiles/"; // path to coordinates file. It can be located in another Apache server: "http://"+WebIP+"/HTMoLv3.5/pdbfiles/";
var TRJDIR="trjfiles/"; // path to trajectory file at BinServer. It is advisable to leave the directory structure as is.

// Coordinates file name
var pdbInicial = PROJECT_ID + '.pdb'; // Examples also included: 'lysozyme.pdb' 'mem_chol.pdb' 'amb.pdb' 'lido_dppc.pdb'
// Trajectory file name
var trjInicial = PROJECT_ID + '.xtc'; // Examples also included: 'lysozyme.xtc' 'mem_chol.dcd' 'amb.xtc' 'lido_dppc.xtc'

var autoplay=false; // How to start the MD visualization

// Definition of molecular representations
var RepresentacionInicial='SpheresBonds'; // Equivalent to CPK. Do not change representation here, use the 'show' command below
var radius = 0.04; // SpheresBonds radius
var SphereResolution = 10; // value has to be >3, use 5 for low resolution, 16 for high resolution
var AxisBool = false; // Draw Axis (X red, Y green, Z blue) and Box (yellow)

// OPTIONAL. Examples for visualization. Select corresponding line accordingly
//var commandsDefault="select 1-9;show VDW;color 1.0,0.0,1.0;select 3540-3549;show VDW;color 1.0,1.0,0.0;select 0:TRP:0;show VDW;color atom;select none;view BackView;zoom 3;"; // for enzyme
//var commandsDefault="show trace;"; // for lysozyme
//**var commandsDefault="show cpk;select S:0:0;show VDW;color atom;"; // for lysozyme. CPK representation, set radius=0.3
//var commandsDefault="show lines;"; // for lysozyme. Line representation
//var commandsDefault="select 0:0:A;show VDW;color atom;"; // for mem_chol
var commandsDefault="select 0:0:A;show VDW;select 0:0:B;show VDW;color atom;"; // for amb
//var commandsDefault="select 45-66;show VDW;color red;select 23-44;show VDW;color green;select 1-22;show VDW;color white;select 0:0:E;show VDW;color yellow;select 0:0:F;show VDW;color 0.6,0.4,0.0;zoom -10;view Custom;"; // for lido_dppc

// MD trajectory information
var tinit=0 // MD start time in picoseconds (ps)
var md_dt=0.002; // MD timestep in picoseconds (ps)
var nstxtcout=10000; // Output frequency saved in trajectory (xtc|dcd) file

// OPTIONAL. It is advised to provide the following information.
 // MD Title
var MDTitle="MYCOBACTERIUM TUBERCULOSIS PHOSPHORIBOSYL ISOMERASE";
 // MD description. Provide Summary, PDB ID, Simulation details, Publication link, etc. Each section should be inside a <p></p> block.
var MDdescription=" <p>Summary: Evolution of Substrate Specificity. MD demonstrated that the narrowing of substrate specificity of an enzyme is concomitant with loss of ancestral protein conformational states. </p> <p>PDB ID: <a href='https://www.rcsb.org/pdb/explore/explore.do?structureId=2Y89' target='_blank'>2Y89</a></p> <p>Simulation: GROMACS 4.5.3 with CHARMM27 all-atom force field with CMAP version 2.0 and explicit TIP3P water and neutralized with NaCl. Minimized for 5,000 conjugate gradient steps and heated up to 300 K during 600 ps with protein atoms harmonically restrained. Equilibration under NvT (300 K) and then under NpT (1 atm), 1 ns each, using the V-rescale and isotropic Berendsen barostat without atom restraints. Long-range electrostatics included with Reaction Field. van der Waals 1.2-nm radius cutoff. LINCS method to restrain all bonds involving hydrogen atoms. MD of 300 ns with a time step of 2 fs.</p> <p>Published in Molecular Biology and Evolution 30:2024 (2013) DOI: <a href='http://dx.doi.org/10.1093/molbev/mst115' target='_blank'>10.1093/molbev/mst115</a></p> ";

// Optimization
var LineW = 2; // width of lines
var LigthPWR = 0.5 // Intensity of light
var mxSize = 20999999; // maximum trajectory file size in bytes. 20999999 is about 21 Mb
var NoPaso = 100; // number of atoms to process in block in the GPU, values has to be <200 due to JavaScript float arrays capacity. Float32Array is used for vertex, and Uint16Array for index

// MD Server
var showOpen = false; // Enable the option to open PDB and trajectory files from the main menu
var showDownload = false; // Enable the option to download the PDB and trajectory files from the main menu

// ======================================================================================== //
