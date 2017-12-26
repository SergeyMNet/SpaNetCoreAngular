import { Action } from '@ngrx/store';
import { Message } from '../../core/home/chat.models';


export const ActionTypes = {
  ADD_OPERATION: 'Add an operation',
  RESET_ALL_OPERATION: 'Reset all operations',
  RESET_OPERATION: 'Reset an operation',
  INCREMENT_OPERATION: 'Increment an operation',
  DECREMENT_OPERATION: 'Decrement an operation',
};




export class AddOperationAction implements Action {
  type = ActionTypes.ADD_OPERATION;
  constructor(public payload: Message) { }
}

export class ResetOperationAction implements Action {
  type = ActionTypes.RESET_OPERATION;
  constructor(public payload: Message) { }
}

export class ResetAllOperationAction implements Action {
  type = ActionTypes.RESET_ALL_OPERATION;
  constructor(public payload: Message) { }
}

export class IncrementOperationAction implements Action {
  type = ActionTypes.INCREMENT_OPERATION;
  constructor(public payload: Message) { }
}

export class DecrementOperationAction implements Action {
  type = ActionTypes.DECREMENT_OPERATION;
  constructor(public payload: Message) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = AddOperationAction |
  ResetAllOperationAction |
  ResetOperationAction |
  IncrementOperationAction |
  DecrementOperationAction;
