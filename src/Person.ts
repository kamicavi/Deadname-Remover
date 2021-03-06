/**
  * A class representing a single person and their associated names (alive and dead)
  * @author: WillHayCode
  */

import { Name } from './Types';

export class Person {
  public alive: Name;
  public dead: Name;

  constructor(alive, dead) {
    this.alive = alive;
    this.dead = dead;
  }
}
