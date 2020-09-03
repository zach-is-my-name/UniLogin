import {ensure} from '@unilogin/commons';
import {WalletState} from '../models/WalletService';
import {InvalidWalletState} from './errors';

type Choose<T, K> = T extends { kind: K } ? T : never;

type Kind = WalletState['kind'];

export function ensureKind <A extends Kind>(state: WalletState, a: A): asserts state is Choose<WalletState, A>;
export function ensureKind <A extends Kind, B extends Kind>(state: WalletState, a: A, b: B): asserts state is Choose<WalletState, A | B>;
export function ensureKind <A extends Kind, B extends Kind, C extends Kind>(state: WalletState, a: A, b: B, c: C): asserts state is Choose<WalletState, A | B | C>;
export function ensureKind <A extends Kind, B extends Kind, C extends Kind, D extends Kind>(state: WalletState, a: A, b: B, c: C, d: D): asserts state is Choose<WalletState, A | B | C | D>;

export function ensureKind(state: WalletState, ...kinds: Kind[]) {
  ensure(kinds.includes(state.kind), InvalidWalletState, kinds.join(' or '), state.kind);
}