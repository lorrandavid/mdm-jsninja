import AppFactory from './app';
import UIFactory from './ui';

const App = AppFactory();
const UI = UIFactory(App);

App.init();
UI.init();
