import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Store from './store/store'

interface StoreState {
    store: Store,
}

const store = new Store();

export const Context = createContext<StoreState>({
    store,
});

ReactDOM.render(
  <React.StrictMode>
      <Context.Provider value={{store}}>
          <App />
      </Context.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
