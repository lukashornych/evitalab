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
  /** Generic scalar that may contain any supported simple scalar. */
  Any: { input: any; output: any; }
  /** Currency in ISO 4217 format. */
  Currency: { input: any; output: any; }
  /** A IETF BCP 47 language tag */
  Locale: { input: any; output: any; }
};

/**
 * This is the definition object for associated data that is stored along with
 * entity. Definition objects allow to describe the structure of the entity type so that
 * in any time everyone can consult complete structure of the entity type.
 *
 * Associated data carry additional data entries that are never used for filtering / sorting but may be needed to be fetched
 * along with entity in order to present data to the target consumer (i.e. user / API / bot). Associated data may be stored
 * in slower storage and may contain wide range of data types - from small ones (i.e. numbers, strings, dates) up to large
 * binary arrays representing entire files (i.e. pictures, documents).
 *
 */
export type AssociatedDataSchema = {
  __typename?: 'AssociatedDataSchema';
  /**
   * Deprecation notice contains information about planned removal of this entity from the model / client API.
   * This allows to plan and evolve the schema allowing clients to adapt early to planned breaking changes.
   *
   * If notice is `null`, this schema is considered not deprecated.
   *
   */
  deprecationNotice?: Maybe<Scalars['String']['output']>;
  /**
   * Contains description of the model is optional but helps authors of the schema / client API to better
   * explain the original purpose of the model to the consumers.
   *
   */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * Localized associated data has to be ALWAYS used in connection with specific `Locale`. In other
   * words - it cannot be stored unless associated locale is also provided.
   *
   */
  localized: Scalars['Boolean']['output'];
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   */
  name: Scalars['String']['output'];
  /**
   * Map contains the `name` variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  nameVariants: NameVariants;
  /**
   * When associated data is nullable, its values may be missing in the entities. Otherwise, the system will enforce
   * non-null checks upon upserting of the entity.
   *
   */
  nullable: Scalars['Boolean']['output'];
  /**
   * Data type of the associated data. Must be one of Evita-supported values.
   * Internally the type is converted into Java-corresponding data type.
   * The type may be scalar type or may represent complex object type (JSON).
   *
   */
  type: Scalars['String']['output'];
};

/**
 * Attribute element is a part of the sortable compound. It defines the attribute name, the direction of the
 * sorting and the behaviour of the null values. The attribute name refers to the existing attribute defined in the
 * schema.
 *
 */
export type AttributeElement = {
  __typename?: 'AttributeElement';
  /**
   * Name of the existing attribute in the same schema.
   *
   */
  attributeName: Scalars['String']['output'];
  /**
   * Behaviour of the null values.
   *
   */
  behaviour: OrderBehaviour;
  /**
   * Direction of the sorting.
   *
   */
  direction: OrderDirection;
};

/**
 * This is the definition object for attributes that are stored along with
 * entity. Definition objects allow to describe the structure of the entity type so that
 * in any time everyone can consult complete structure of the entity type. Definition object is similar to Java reflection
 * process where you can also at any moment see which fields and methods are available for the class.
 *
 * Entity attributes allows defining set of data that are fetched in bulk along with the entity body.
 * Attributes may be indexed for fast filtering or can be used to sort along. Attributes are not automatically indexed
 * in order not to waste precious memory space for data that will never be used in search queries.
 *
 * Filtering in attributes is executed by using constraints like `and`, `or`, `not`,
 * `attribute_{name}_equals`, `attribute_{name}_contains` and many others. Sorting can be achieved with
 * `attribute_{name}_natural` or others.
 *
 * Attributes are not recommended for bigger data as they are all loaded at once when requested.
 * Large data that are occasionally used store in associated data.
 *
 */
export type AttributeSchema = {
  __typename?: 'AttributeSchema';
  /**
   * Default value is used when the entity is created without this attribute specified. Default values allow to pass
   * non-null checks even if no attributes of such name are specified.
   *
   */
  defaultValue?: Maybe<Scalars['Any']['output']>;
  /**
   * Deprecation notice contains information about planned removal of this entity from the model / client API.
   * This allows to plan and evolve the schema allowing clients to adapt early to planned breaking changes.
   *
   * If notice is `null`, this schema is considered not deprecated.
   *
   */
  deprecationNotice?: Maybe<Scalars['String']['output']>;
  /**
   * Contains description of the model is optional but helps authors of the schema / client API to better
   * explain the original purpose of the model to the consumers.
   *
   */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * When attribute is filterable, it is possible to filter entities by this attribute. Do not mark attribute
   * as filterable unless you know that you'll search entities by this attribute. Each filterable attribute occupies
   * (memory/disk) space in the form of index.
   *
   * When attribute is filterable, extra result `attributeHistogram`
   * can be requested for this attribute.
   *
   */
  filterable: Scalars['Boolean']['output'];
  /**
   * Determines how many fractional places are important when entities are compared during filtering or sorting. It is
   * significant to know that all values of this attribute will be converted to `Int`, so the attribute
   * number must not ever exceed maximum limits of `Int` type when scaling the number by the power
   * of ten using `indexedDecimalPlaces` as exponent.
   *
   */
  indexedDecimalPlaces: Scalars['Int']['output'];
  /**
   * When attribute is localized, it has to be ALWAYS used in connection with specific `Locale`.
   *
   */
  localized: Scalars['Boolean']['output'];
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   */
  name: Scalars['String']['output'];
  /**
   * Map contains the `name` variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  nameVariants: NameVariants;
  /**
   * When attribute is nullable, its values may be missing in the entities. Otherwise, the system will enforce
   * non-null checks upon upserting of the entity.
   *
   */
  nullable: Scalars['Boolean']['output'];
  /**
   * When attribute is sortable, it is possible to sort entities by this attribute. Do not mark attribute
   * as sortable unless you know that you'll sort entities along this attribute. Each sortable attribute occupies
   * (memory/disk) space in the form of index..
   *
   */
  sortable: Scalars['Boolean']['output'];
  /**
   * Data type of the attribute. Must be one of Evita-supported values.
   * Internally the scalar is converted into Java-corresponding data type.
   *
   */
  type: Scalars['String']['output'];
  /**
   * When attribute is unique it is automatically filterable, and it is ensured there is exactly one single entity
   * having certain value of this attribute among other entities in the same collection.
   *
   * As an example of unique attribute can be EAN - there is no sense in having two entities with same EAN, and it's
   * better to have this ensured by the database engine.
   *
   */
  unique: Scalars['Boolean']['output'];
};

/**
 * This is the definition object for attributes that are stored along with
 * entity. Definition objects allow to describe the structure of the entity type so that
 * in any time everyone can consult complete structure of the entity type. Definition object is similar to Java reflection
 * process where you can also at any moment see which fields and methods are available for the class.
 *
 * Entity attributes allows defining set of data that are fetched in bulk along with the entity body.
 * Attributes may be indexed for fast filtering or can be used to sort along. Attributes are not automatically indexed
 * in order not to waste precious memory space for data that will never be used in search queries.
 *
 * Filtering in attributes is executed by using constraints like `and`, `or`, `not`,
 * `attribute_{name}_equals`, `attribute_{name}_contains` and many others. Sorting can be achieved with
 * `attribute_{name}_natural` or others.
 *
 * Attributes are not recommended for bigger data as they are all loaded at once when requested.
 * Large data that are occasionally used store in associated data.
 *
 */
export type AttributeSchemaUnion = AttributeSchema | GlobalAttributeSchema;

export enum Cardinality {
  ExactlyOne = 'EXACTLY_ONE',
  OneOrMore = 'ONE_OR_MORE',
  ZeroOrMore = 'ZERO_OR_MORE',
  ZeroOrOne = 'ZERO_OR_ONE'
}

/**
 * Internal Evita's catalog schema containing structural information about one Evita catalog.
 *
 */
export type CatalogSchema = {
  __typename?: 'CatalogSchema';
  /**
   * Contains index of generally (catalog-wide) shared `AttributeSchema` that could be used as attributes of any
   *          entity type that refers them. These attributes cannot be changed from within the entity schema. Entity schemas
   *          will not be able to define their own attribute of same name that would clash with the global one (they may only
   *          reference the attributes with the same name from the catalog schema).
   *
   *          There may be entities that won't take advantage of certain global attributes (i.e. it's not guaranteed that all
   *          entity types in catalog have all global attributes).
   *
   *          The "catalog-wide" unique attributes allows Evita to fetch entity of any (and up-front unknown) entity type by
   *          some unique attribute value - usually URL.
   *
   */
  allAttributes: Array<GlobalAttributeSchema>;
  /**
   * Contains index of entity schemas for all collections in this catalog.
   *
   */
  allEntitySchemas: Array<EntitySchema>;
  /**
   * Contains index of generally (catalog-wide) shared `AttributeSchema` that could be used as attributes of any
   *          entity type that refers them. These attributes cannot be changed from within the entity schema. Entity schemas
   *          will not be able to define their own attribute of same name that would clash with the global one (they may only
   *          reference the attributes with the same name from the catalog schema).
   *
   *          There may be entities that won't take advantage of certain global attributes (i.e. it's not guaranteed that all
   *          entity types in catalog have all global attributes).
   *
   *          The "catalog-wide" unique attributes allows Evita to fetch entity of any (and up-front unknown) entity type by
   *          some unique attribute value - usually URL.
   *
   */
  attributes: GlobalAttributeSchemas;
  /**
   * Contains description of the model is optional but helps authors of the schema / client API to better
   * explain the original purpose of the model to the consumers.
   *
   */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   */
  name: Scalars['String']['output'];
  /**
   * Map contains the `name` variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  nameVariants: NameVariants;
  /**
   * Contains version of this definition object and gets increased with any entity type update. Allows to execute
   * optimistic locking i.e. avoiding parallel modifications.
   *
   */
  version: Scalars['Int']['output'];
};

/**
 * This is the definition object for entity. Definition objects allow to describe the structure
 * of the entity type so that in any time everyone can consult complete structure of the entity type.
 *
 * Based on our experience we've designed following data model for handling entities in evitaDB. Model is rather complex
 * but was designed to limit amount of data fetched from database and minimize an amount of data that are indexed and subject
 * to search.
 *
 * Minimal entity definition consists of:
 * - entity type and
 * - primary key (even this is optional and may be autogenerated by the database).
 *
 * Other entity data is purely optional and may not be used at all.
 *
 */
export type EntitySchema = {
  __typename?: 'EntitySchema';
  /**
   * Contains index of all `AssociatedDataSchema` that could be used as associated data of entity of this type.
   *
   * Associated data carry additional data entries that are never used for filtering / sorting but may be needed to be fetched
   * along with entity in order to present data to the target consumer (i.e. user / API / bot). Associated data may be stored
   * in slower storage and may contain wide range of data types - from small ones (i.e. numbers, strings, dates) up to large
   * binary arrays representing entire files (i.e. pictures, documents).
   *
   * The search query must contain specific associated data fields in order
   * associated data are fetched along with the entity. Associated data are stored and fetched separately by their name.
   *
   */
  allAssociatedData: Array<AssociatedDataSchema>;
  /**
   * Contains index of all `AttributeSchema` that could be used as attributes of entity of this type.
   *
   * Entity (global) attributes allows defining set of data that are fetched in bulk along with the entity body.
   * Attributes may be indexed for fast filtering (`AttributeSchema.filterable`) or can be used to sort along
   * (`AttributeSchema.sortable`). Attributes are not automatically indexed in order not to waste precious
   * memory space for data that will never be used in search queries.
   *
   * Filtering in attributes is executed by using constraints like `and`,
   * `not`, `attribute_{name}_equals`, `attribute_{name}_contains`
   * and many others. Sorting can be achieved with `attribute_{name}_natural` or others.
   *
   * Attributes are not recommended for bigger data as they are all loaded at once requested.
   * Large data that are occasionally used store in `associatedData`.
   *
   */
  allAttributes: Array<AttributeSchemaUnion>;
  /**
   * Contains index of all `ReferenceSchema` that could be used as references of entity of this type.
   *
   * References refer to other entities (of same or different entity type).
   * Allows entity filtering (but not sorting) of the entities by using `facet_{reference name}_inSet` constraint
   * and statistics computation when `facetStatistics` extra result is requested. Reference
   * is uniquely represented by int positive number (max. 2<sup>63</sup>-1) and entity type and can be
   * part of multiple reference groups, that are also represented by int and entity type.
   *
   * Reference id in one entity is unique and belongs to single reference group id. Among multiple entities reference may be part
   * of different reference groups. Referenced entity type may represent type of another Evita entity or may refer
   * to anything unknown to Evita that posses unique int key and is maintained by external systems (fe. tag assignment,
   * group assignment, category assignment, stock assignment and so on). Not all these data needs to be present in
   * Evita.
   *
   * References may carry additional key-value data linked to this entity relation (fe. item count present on certain stock).
   * The search query must contain specific `referenceContent` requirement in order
   * references are fetched along with the entity.
   *
   */
  allReferences: Array<ReferenceSchema>;
  /**
   * Contains definitions of all sortable attribute compounds defined in this schema.
   *
   */
  allSortableAttributeCompounds: Array<SortableAttributeCompoundSchema>;
  /**
   * Contains set of all `Currency` that could be used for `prices` in entities of this type.
   *
   */
  currencies: Array<Scalars['Currency']['output']>;
  /**
   * Deprecation notice contains information about planned removal of this entity from the model / client API.
   * This allows to plan and evolve the schema allowing clients to adapt early to planned breaking changes.
   *
   * If notice is `null`, this schema is considered not deprecated.
   *
   */
  deprecationNotice?: Maybe<Scalars['String']['output']>;
  /**
   * Contains description of the model is optional but helps authors of the schema / client API to better
   * explain the original purpose of the model to the consumers.
   *
   */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * Evolution mode allows to specify how strict is evitaDB when unknown information is presented to her for the first
   * time. When no evolution mode is set, each violation of the `EntitySchema` is
   * reported by an exception. This behaviour can be changed by this evolution mode however.
   *
   */
  evolutionMode: Array<Scalars['String']['output']>;
  /**
   * Determines how many fractional places are important when entities are compared during filtering or sorting. It is
   * important to know that all prices will be converted to `Int`, so any of the price values
   * (either with or without tax) must not ever exceed maximum limits of `Int` type when scaling
   * the number by the power of ten using `indexedPricePlaces` as exponent.
   *
   */
  indexedPricePlaces: Scalars['Int']['output'];
  /**
   * Contains set of all `Locale` that could be used for localized `AttributeSchema` or `AssociatedDataSchema`.
   * Enables using `entityLocaleEquals` filtering constraint in query.
   *
   */
  locales: Array<Scalars['Locale']['output']>;
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   */
  name: Scalars['String']['output'];
  /**
   * Map contains the `name` variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  nameVariants: NameVariants;
  /**
   * Contains version of this definition object and gets increased with any entity type update. Allows to execute
   * optimistic locking i.e. avoiding parallel modifications.
   *
   */
  version: Scalars['Int']['output'];
  /**
   * Contains `true` when primary keys of entities of this type will not be provided by the external systems and Evita
   * is responsible for generating unique primary keys for the entity on insertion.
   *
   * Generated key is guaranteed to be unique, but may not represent continuous ascending series. Generated key
   * will be always greater than zero.
   *
   */
  withGeneratedPrimaryKey: Scalars['Boolean']['output'];
  /**
   * Contains `true` when entities of this type are organized in a tree like structure (hierarchy) where certain entities
   * are subordinate of other entities.
   *
   * Entities may be organized in hierarchical fashion. That means that entity may refer to single parent entity and may be
   * referred by multiple child entities. Hierarchy is always composed of entities of same type.
   * Each entity must be part of at most single hierarchy (tree).
   *
   * Hierarchy can limit returned entities by using filtering constraints. It's also used for
   * computation of extra data - such as `hierarchyParentsOfSelf`. It can also invert type of returned entities in case extra result
   * `hierarchyOfSelf` is requested.
   *
   */
  withHierarchy: Scalars['Boolean']['output'];
  /**
   * Contains `true` when entities of this type holds price information.
   *
   * Prices are specific to a very few entities, but because correct price computation is very complex in e-commerce
   * systems and highly affects performance of the entities filtering and sorting, they deserve first class support
   * in entity model. It is pretty common in B2B systems single product has assigned dozens of prices for the different
   * customers.
   *
   * Specifying prices on entity allows usage of `priceValidIn`, `priceInCurrency`
   * `priceBetween`, and `priceInPriceLists` filtering constraints and also `priceNatural`,
   * ordering of the entities. Additional extra result
   * `priceHistogram` and requirement `priceType` can be used in query as well.
   *
   */
  withPrice: Scalars['Boolean']['output'];
};

/**
 * This is the definition object for attributes that are stored along with
 * catalog. Definition objects allow to describe the structure of the catalog so that
 * in any time everyone can consult complete structure of the catalog. Definition object is similar to Java reflection
 * process where you can also at any moment see which fields and methods are available for the class.
 *
 * Catalog attributes allows defining set of data that are fetched in bulk along with the catalog body.
 * Attributes may be indexed for fast filtering or can be used to sort along. Attributes are not automatically indexed
 * in order not to waste precious memory space for data that will never be used in search queries.
 *
 * Filtering in attributes is executed by using constraints like `and`, `or`, `not`,
 * `attribute_{name}_equals`, `attribute_{name}_contains` and many others. Sorting can be achieved with
 * `attribute_{name}_natural` or others.
 *
 * Attributes are not recommended for bigger data as they are all loaded at once when requested.
 *
 */
export type GlobalAttributeSchema = {
  __typename?: 'GlobalAttributeSchema';
  /**
   * Default value is used when the entity is created without this attribute specified. Default values allow to pass
   * non-null checks even if no attributes of such name are specified.
   *
   */
  defaultValue?: Maybe<Scalars['Any']['output']>;
  /**
   * Deprecation notice contains information about planned removal of this entity from the model / client API.
   * This allows to plan and evolve the schema allowing clients to adapt early to planned breaking changes.
   *
   * If notice is `null`, this schema is considered not deprecated.
   *
   */
  deprecationNotice?: Maybe<Scalars['String']['output']>;
  /**
   * Contains description of the model is optional but helps authors of the schema / client API to better
   * explain the original purpose of the model to the consumers.
   *
   */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * When attribute is filterable, it is possible to filter entities by this attribute. Do not mark attribute
   * as filterable unless you know that you'll search entities by this attribute. Each filterable attribute occupies
   * (memory/disk) space in the form of index.
   *
   * When attribute is filterable, extra result `attributeHistogram`
   * can be requested for this attribute.
   *
   */
  filterable: Scalars['Boolean']['output'];
  /**
   * Determines how many fractional places are important when entities are compared during filtering or sorting. It is
   * significant to know that all values of this attribute will be converted to `Int`, so the attribute
   * number must not ever exceed maximum limits of `Int` type when scaling the number by the power
   * of ten using `indexedDecimalPlaces` as exponent.
   *
   */
  indexedDecimalPlaces: Scalars['Int']['output'];
  /**
   * When attribute is localized, it has to be ALWAYS used in connection with specific `Locale`.
   *
   */
  localized: Scalars['Boolean']['output'];
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   */
  name: Scalars['String']['output'];
  /**
   * Map contains the `name` variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  nameVariants: NameVariants;
  /**
   * When attribute is nullable, its values may be missing in the entities. Otherwise, the system will enforce
   * non-null checks upon upserting of the entity.
   *
   */
  nullable: Scalars['Boolean']['output'];
  /**
   * When attribute is sortable, it is possible to sort entities by this attribute. Do not mark attribute
   * as sortable unless you know that you'll sort entities along this attribute. Each sortable attribute occupies
   * (memory/disk) space in the form of index..
   *
   */
  sortable: Scalars['Boolean']['output'];
  /**
   * Data type of the attribute. Must be one of Evita-supported values.
   * Internally the scalar is converted into Java-corresponding data type.
   *
   */
  type: Scalars['String']['output'];
  /**
   * When attribute is unique it is automatically filterable, and it is ensured there is exactly one single entity
   * having certain value of this attribute among other entities in the same collection.
   *
   * As an example of unique attribute can be EAN - there is no sense in having two entities with same EAN, and it's
   * better to have this ensured by the database engine.
   *
   */
  unique: Scalars['Boolean']['output'];
  /**
   * When attribute is unique globally it is automatically filterable, and it is ensured there is exactly one single
   *          entity having certain value of this attribute in entire catalog.
   *
   *          As an example of unique attribute can be URL - there is no sense in having two entities with same URL, and it's
   *          better to have this ensured by the database engine.
   *
   */
  uniqueGlobally: Scalars['Boolean']['output'];
};

/**
 * Contains all global attributes schemas relevant for parent schema.
 *
 */
export type GlobalAttributeSchemas = {
  __typename?: 'GlobalAttributeSchemas';
  /** Date and time of the last change of this entity. */
  changed: GlobalAttributeSchema;
  /**
   * Unique code that identifies the entity among other entities of the same kind.
   * The code is equivalent to primary key but is targeted on external consumers (systems).
   */
  code: GlobalAttributeSchema;
  /** Full description of the entity in HTML format. */
  description: GlobalAttributeSchema;
  /** Shortened version of description of the entity in plain text. */
  descriptionShort: GlobalAttributeSchema;
  /** Localized name of the entity. */
  name: GlobalAttributeSchema;
  /**
   * Returns the status of the entity:
   *
   * - ACTIVE: entity is available on frontend
   * - PRIVATE: entity is  not available on frontend, but it's visible in administration
   */
  status: GlobalAttributeSchema;
  /** Localized and globally unique URL of the entity. */
  url: GlobalAttributeSchema;
  /**
   * Old URLs that has been originally assigned to the entity, but are no longer active. Each value that was
   * once `url` but was changed to something else is moved to this list. Thi allows accessing the entity even
   * on the previous location (with redirect) so that remembered URLs in external systems don't end up with
   * "entity not found" response.
   */
  urlInactive: GlobalAttributeSchema;
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

export enum OrderBehaviour {
  NullsFirst = 'NULLS_FIRST',
  NullsLast = 'NULLS_LAST'
}

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

/**
 * This is the definition object for reference that is stored along with
 * entity. Definition objects allow to describe the structure of the entity type so that
 * in any time everyone can consult complete structure of the entity type.
 *
 * The references refer to other entities (of same or different entity type).
 * Allows entity filtering (but not sorting) of the entities by using `facet_{name}_inSet` query
 * and statistics computation if when requested. Reference
 * is uniquely represented by int positive number (max. 2<sup>63</sup>-1) and entity type and can be
 * part of multiple reference groups, that are also represented by int and entity type.
 *
 * Reference id in one entity is unique and belongs to single reference group id. Among multiple entities reference may be part
 * of different reference groups. Referenced entity type may represent type of another Evita entity or may refer
 * to anything unknown to Evita that posses unique int key and is maintained by external systems (fe. tag assignment,
 * group assignment, category assignment, stock assignment and so on). Not all these data needs to be present in
 * Evita.
 *
 * References may carry additional key-value data linked to this entity relation (fe. item count present on certain stock).
 *
 */
export type ReferenceSchema = {
  __typename?: 'ReferenceSchema';
  /**
   * Attributes related to reference allows defining set of data that are fetched in bulk along with the entity body.
   * Attributes may be indexed for fast filtering (`AttributeSchema.filterable`) or can be used to sort along
   * (`AttributeSchema.filterable`). Attributes are not automatically indexed in order not to waste precious
   * memory space for data that will never be used in search queries.
   *
   * Filtering in attributes is executed by using constraints like `and`,
   * `not`, `attribute_{name}_equals`, `attribute_{name}_contains`
   * and many others. Sorting can be achieved with `attribute_{name}_natural` or others.
   *
   * Attributes are not recommended for bigger data as they are all loaded at once.
   *
   */
  allAttributes: Array<AttributeSchema>;
  /**
   * Contains definitions of all sortable attribute compounds defined in this schema.
   *
   */
  allSortableAttributeCompounds: Array<SortableAttributeCompoundSchema>;
  /**
   * Cardinality describes the expected count of relations of this type. In evitaDB we define only one-way
   * relationship from the perspective of the entity. We stick to the ERD modelling
   * [standards](https://www.gleek.io/blog/crows-foot-notation.html) here. Cardinality affect the design
   * of the client API (returning only single reference or collections) and also help us to protect the consistency
   * of the data so that conforms to the creator mental model.
   *
   */
  cardinality: Cardinality;
  /**
   * Deprecation notice contains information about planned removal of this entity from the model / client API.
   * This allows to plan and evolve the schema allowing clients to adapt early to planned breaking changes.
   *
   * If notice is `null`, this schema is considered not deprecated.
   *
   */
  deprecationNotice?: Maybe<Scalars['String']['output']>;
  /**
   * Contains description of the model is optional but helps authors of the schema / client API to better
   * explain the original purpose of the model to the consumers.
   *
   */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * Map contains the `entityType` name variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  entityTypeNameVariants: NameVariants;
  /**
   * Contains `true` if the statistics data for this reference should be maintained and this allowing to get
   * `facetStatistics` for this reference or use `facet_{reference name}_inSet`
   * filtering constraint.
   *
   * Do not mark reference as faceted unless you want it among `facetStatistics`. Each faceted reference
   * occupies (memory/disk) space in the form of index.
   *
   * Reference that was marked as faceted is called Facet.
   *
   */
  faceted: Scalars['Boolean']['output'];
  /**
   * Map contains the `groupType` name variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  groupTypeNameVariants?: Maybe<NameVariants>;
  /**
   * Contains `true` if the index for this reference should be created and maintained allowing to filter by
   * `reference_{reference name}_having` filtering constraints. Index is also required when reference is
   * `faceted`.
   *
   * Do not mark reference as faceted unless you know that you'll need to filter/sort entities by this reference.
   * Each indexed reference occupies (memory/disk) space in the form of index. When reference is not indexed,
   * the entity cannot be looked up by reference attributes or relation existence itself, but the data can be
   * fetched.
   *
   */
  indexed: Scalars['Boolean']['output'];
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   */
  name: Scalars['String']['output'];
  /**
   * Map contains the `name` variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  nameVariants: NameVariants;
  /**
   * Reference to `Entity.type` of the referenced entity. Might be also any `String`
   * that identifies type some external resource not maintained by Evita.
   *
   */
  referencedEntityType: Scalars['String']['output'];
  /**
   * Contains `true` if `entityType` refers to any existing entity that is maintained
   * by Evita.
   *
   */
  referencedEntityTypeManaged: Scalars['Boolean']['output'];
  /**
   * Reference to `Entity.type` of the referenced entity. Might be also `String`
   * that identifies type some external resource not maintained by Evita.
   *
   */
  referencedGroupType?: Maybe<Scalars['String']['output']>;
  /**
   * Contains `true` if `groupType` refers to any existing entity that is maintained
   * by Evita.
   *
   */
  referencedGroupTypeManaged?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Sortable attribute compounds are used to sort entities or references by multiple attributes at once. evitaDB
 * requires a pre-sorted index in order to be able to sort entities or references by particular attribute or
 * combination of attributes, so it can deliver the results as fast as possible. Sortable attribute compounds
 * are filtered the same way as attributes - using natural ordering constraint.
 *
 */
export type SortableAttributeCompoundSchema = {
  __typename?: 'SortableAttributeCompoundSchema';
  /**
   * Collection of attribute elements that define the sortable compound. The order of the elements
   * is important, as it defines the order of the sorting.
   *
   */
  attributeElements: Array<AttributeElement>;
  /**
   * Deprecation notice contains information about planned removal of this entity from the model / client API.
   * This allows to plan and evolve the schema allowing clients to adapt early to planned breaking changes.
   *
   * If notice is `null`, this schema is considered not deprecated.
   *
   */
  deprecationNotice?: Maybe<Scalars['String']['output']>;
  /**
   * Contains description of the model is optional but helps authors of the schema / client API to better
   * explain the original purpose of the model to the consumers.
   *
   */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   */
  name: Scalars['String']['output'];
  /**
   * Map contains the `name` variants in different naming conventions. The name
   * is guaranteed to be unique among other references in same convention. These names are used to quickly
   * translate to / from names used in different protocols. Each API protocol prefers names in different naming
   * conventions.
   *
   */
  nameVariants: NameVariants;
};

