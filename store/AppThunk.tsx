import { AnyAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export type AppThunk = ThunkAction<void, RootState, unknown, AnyAction>;
