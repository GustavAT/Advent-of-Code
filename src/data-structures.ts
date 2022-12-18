export class Node {
  public value: number;
  public previous!: Node;
  public next!: Node;

  constructor(value: number) {
    this.value = value;
  }
}

/**
 * Circular ring buffer that gives the next element upon calling next().
 */
export class CircularArray<T> {
  private index: number = 0;
  private readonly source: T[];

  constructor(source: T[]) {
    this.source = source;
  }

  next(): T {
    const element = this.source[this.index];
    this.index++;
    if (this.index === this.source.length) {
      this.index = 0;
    }

    return element;
  }

  getIndex(): number {
    return this.index;
  }
}
