/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A 64-bit signed integer */
  Long: { input: any; output: any; }
};

/**
 * Catalog is a fragment of evitaDB database that can be compared to a schema of relational database. Catalog allows
 * handling multiple isolated data collections inside single evitaDB instance. Catalogs in evitaDB are isolated one from
 * another and share no single thing.
 *
 * Catalog is an abstraction for "database" in the sense of relational databases. Catalog contains all entities and data
 * connected with single client. In the e-commerce world catalog means "single e-shop" although it may not be the truth
 * in every case. Catalog manages set of entity collection uniquely identified by their name.
 *
 */
export type Catalog = {
  __typename?: 'Catalog';
  /**
   * State of this catalog instance.
   *
   */
  catalogState: CatalogState;
  /**
   * Whether this catalog is corrupted or can be freely used.
   *
   */
  corrupted: Scalars['Boolean']['output'];
  /**
   * Set of all maintained entity collections - i.e. entity types.
   *
   */
  entityTypes: Array<Scalars['String']['output']>;
  /**
   * Name of the catalog. Name must be unique across all catalogs inside same evitaDB instance.
   *
   */
  name: Scalars['String']['output'];
  /**
   *          Map contains the `name` variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  nameVariants: NameVariants;
  /**
   * Returns true if catalog supports transaction.
   *
   */
  supportsTransaction: Scalars['Boolean']['output'];
  /**
   * Catalog header version that is incremented with each update. Version is not stored on the disk,
   * it serves only to distinguish whether there is any change made in the header and whether it needs to be persisted
   * on disk.
   *
   */
  version: Scalars['Long']['output'];
};

export enum CatalogState {
  Alive = 'ALIVE',
  WarmingUp = 'WARMING_UP'
}

/**
 * Contains all possible catalog instance implementations.
 *
 */
export type CatalogUnion = Catalog | CorruptedCatalog;

/**
 * Catalog instance that cannot be loaded into a memory due an error.
 * The original exception and catalog path are accessible via. `catalogStoragePath` and `cause` properties.
 *
 */
export type CorruptedCatalog = {
  __typename?: 'CorruptedCatalog';
  /**
   * Path to original catalog.
   *
   */
  catalogStoragePath: Scalars['String']['output'];
  /**
   * Cause of catalog corruption.
   *
   */
  cause: Scalars['String']['output'];
  /**
   * Whether this catalog is corrupted or can be freely used.
   *
   */
  corrupted: Scalars['Boolean']['output'];
  /**
   * Name of the catalog. Name must be unique across all catalogs inside same evitaDB instance.
   *
   */
  name: Scalars['String']['output'];
};

/**
 * Contains all name variants of parent object.
 *
 */
export type NameVariants = {
  __typename?: 'NameVariants';
  /**
   * [Camel case variant](https://en.wikipedia.org/wiki/Camel_case)
   *
   */
  camelCase: Scalars['String']['output'];
  /**
   * [Kebab case variant](https://en.wikipedia.org/wiki/Letter_case#Kebab_case)
   *
   */
  kebabCase: Scalars['String']['output'];
  /**
   * [Pascal case variant](https://www.theserverside.com/definition/Pascal-case)
   *
   */
  pascalCase: Scalars['String']['output'];
  /**
   * [Snake case variant](https://en.wikipedia.org/wiki/Snake_case)
   *
   */
  snakeCase: Scalars['String']['output'];
  /**
   * [Capitalized snake case variant](https://en.wikipedia.org/wiki/Snake_case)
   *
   */
  upperSnakeCase: Scalars['String']['output'];
};

