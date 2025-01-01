#!/bin/bash
echo "Mulai server dan deploy web lu, brengsek!"
npm install  # Install dependencies
node server.js &  # Jalanin backend
echo "Server jalan di background, siap perang!"
