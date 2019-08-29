import {OPEN_MODAL} from './modal.reducer';

// eslint-disable-next-line no-unused-vars
export const hotjarMiddleware = store => next => action => {
  switch (action.type) {
    case OPEN_MODAL:
      if (action.modal === 'order') {
        if (typeof window.hj === 'function') {
          window.hj('trigger', 'order_book');
        }
      }

      return next(action);

    default:
      return next(action);
  }
};
