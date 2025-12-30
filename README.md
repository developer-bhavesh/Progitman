# README

## About

Progitman is a modern desktop application built with Wails, combining the power of Go backend with a React frontend. This project provides a seamless cross-platform experience with native performance and modern web technologies.

**Developed by:** Solanki Bhavesh  
**Contributor:** Shreyas Shuresh

This application leverages the Wails framework to create native desktop applications using web technologies, offering the best of both worlds - the performance of Go and the flexibility of React.

You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.
