// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file GrpcAssociatedDataSchemaMutations.proto (package io.evitadb.externalApi.grpc.generated, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3, StringValue } from "@bufbuild/protobuf";
import { GrpcEvitaAssociatedDataDataType_GrpcEvitaDataType } from "./GrpcEnums_pb.js";

/**
 * Mutation is responsible for setting up a new `AssociatedDataSchema` in the `EntitySchema`.
 * Mutation can be used for altering also the existing `AssociatedDataSchema` alone.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcCreateAssociatedDataSchemaMutation
 */
export class GrpcCreateAssociatedDataSchemaMutation extends Message<GrpcCreateAssociatedDataSchemaMutation> {
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * Contains description of the model is optional but helps authors of the schema / client API to better
   * explain the original purpose of the model to the consumers.
   *
   * @generated from field: google.protobuf.StringValue description = 2;
   */
  description?: string;

  /**
   * Deprecation notice contains information about planned removal of this associated data from the model / client API.
   * This allows to plan and evolve the schema allowing clients to adapt early to planned breaking changes.
   *
   * @generated from field: google.protobuf.StringValue deprecationNotice = 3;
   */
  deprecationNotice?: string;

  /**
   * Contains the data type of the entity. Must be one of supported types or may
   * represent complex type - which is JSON object that can be automatically converted
   * to the set of basic types.
   *
   * @generated from field: io.evitadb.externalApi.grpc.generated.GrpcEvitaAssociatedDataDataType.GrpcEvitaDataType type = 4;
   */
  type = GrpcEvitaAssociatedDataDataType_GrpcEvitaDataType.STRING;

  /**
   * Localized associated data has to be ALWAYS used in connection with specific `locale`. In other
   * words - it cannot be stored unless associated locale is also provided.
   *
   * @generated from field: bool localized = 5;
   */
  localized = false;

  /**
   * When associated data is nullable, its values may be missing in the entities. Otherwise, the system will enforce
   * non-null checks upon upserting of the entity.
   *
   * @generated from field: bool nullable = 6;
   */
  nullable = false;

  constructor(data?: PartialMessage<GrpcCreateAssociatedDataSchemaMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcCreateAssociatedDataSchemaMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "message", T: StringValue },
    { no: 3, name: "deprecationNotice", kind: "message", T: StringValue },
    { no: 4, name: "type", kind: "enum", T: proto3.getEnumType(GrpcEvitaAssociatedDataDataType_GrpcEvitaDataType) },
    { no: 5, name: "localized", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 6, name: "nullable", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcCreateAssociatedDataSchemaMutation {
    return new GrpcCreateAssociatedDataSchemaMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcCreateAssociatedDataSchemaMutation {
    return new GrpcCreateAssociatedDataSchemaMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcCreateAssociatedDataSchemaMutation {
    return new GrpcCreateAssociatedDataSchemaMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcCreateAssociatedDataSchemaMutation | PlainMessage<GrpcCreateAssociatedDataSchemaMutation> | undefined, b: GrpcCreateAssociatedDataSchemaMutation | PlainMessage<GrpcCreateAssociatedDataSchemaMutation> | undefined): boolean {
    return proto3.util.equals(GrpcCreateAssociatedDataSchemaMutation, a, b);
  }
}

/**
 * Mutation is responsible for setting value to a `AssociatedDataSchemaContract.deprecationNotice`
 * in `EntitySchema`.
 * Mutation can be used for altering also the existing `AssociatedDataSchema` alone.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation
 */
export class GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation extends Message<GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation> {
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * Deprecation notice contains information about planned removal of this associated data from the model / client API.
   * This allows to plan and evolve the schema allowing clients to adapt early to planned breaking changes.
   *
   * @generated from field: google.protobuf.StringValue deprecationNotice = 2;
   */
  deprecationNotice?: string;

  constructor(data?: PartialMessage<GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "deprecationNotice", kind: "message", T: StringValue },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation {
    return new GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation {
    return new GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation {
    return new GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation | PlainMessage<GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation> | undefined, b: GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation | PlainMessage<GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation> | undefined): boolean {
    return proto3.util.equals(GrpcModifyAssociatedDataSchemaDeprecationNoticeMutation, a, b);
  }
}

/**
 * Mutation is responsible for setting value to a `AssociatedDataSchema.description`
 * in `EntitySchema`.
 * Mutation can be used for altering also the existing `AssociatedDataSchema` alone.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcModifyAssociatedDataSchemaDescriptionMutation
 */
export class GrpcModifyAssociatedDataSchemaDescriptionMutation extends Message<GrpcModifyAssociatedDataSchemaDescriptionMutation> {
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * Contains description of the model is optional but helps authors of the schema / client API to better
   * explain the original purpose of the model to the consumers.
   *
   * @generated from field: google.protobuf.StringValue description = 2;
   */
  description?: string;

  constructor(data?: PartialMessage<GrpcModifyAssociatedDataSchemaDescriptionMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcModifyAssociatedDataSchemaDescriptionMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "message", T: StringValue },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcModifyAssociatedDataSchemaDescriptionMutation {
    return new GrpcModifyAssociatedDataSchemaDescriptionMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcModifyAssociatedDataSchemaDescriptionMutation {
    return new GrpcModifyAssociatedDataSchemaDescriptionMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcModifyAssociatedDataSchemaDescriptionMutation {
    return new GrpcModifyAssociatedDataSchemaDescriptionMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcModifyAssociatedDataSchemaDescriptionMutation | PlainMessage<GrpcModifyAssociatedDataSchemaDescriptionMutation> | undefined, b: GrpcModifyAssociatedDataSchemaDescriptionMutation | PlainMessage<GrpcModifyAssociatedDataSchemaDescriptionMutation> | undefined): boolean {
    return proto3.util.equals(GrpcModifyAssociatedDataSchemaDescriptionMutation, a, b);
  }
}

/**
 * Mutation is responsible for renaming an existing `AssociatedDataSchema` in `EntitySchema`.
 * Mutation can be used for altering also the existing `AssociatedDataSchema` alone.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcModifyAssociatedDataSchemaNameMutation
 */
export class GrpcModifyAssociatedDataSchemaNameMutation extends Message<GrpcModifyAssociatedDataSchemaNameMutation> {
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   * @generated from field: string newName = 2;
   */
  newName = "";

  constructor(data?: PartialMessage<GrpcModifyAssociatedDataSchemaNameMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcModifyAssociatedDataSchemaNameMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "newName", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcModifyAssociatedDataSchemaNameMutation {
    return new GrpcModifyAssociatedDataSchemaNameMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcModifyAssociatedDataSchemaNameMutation {
    return new GrpcModifyAssociatedDataSchemaNameMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcModifyAssociatedDataSchemaNameMutation {
    return new GrpcModifyAssociatedDataSchemaNameMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcModifyAssociatedDataSchemaNameMutation | PlainMessage<GrpcModifyAssociatedDataSchemaNameMutation> | undefined, b: GrpcModifyAssociatedDataSchemaNameMutation | PlainMessage<GrpcModifyAssociatedDataSchemaNameMutation> | undefined): boolean {
    return proto3.util.equals(GrpcModifyAssociatedDataSchemaNameMutation, a, b);
  }
}

/**
 * Mutation is responsible for setting value to a `AssociatedDataSchema.type` in `EntitySchema`.
 * Mutation can be used for altering also the existing `AssociatedDataSchema` alone.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcModifyAssociatedDataSchemaTypeMutation
 */
export class GrpcModifyAssociatedDataSchemaTypeMutation extends Message<GrpcModifyAssociatedDataSchemaTypeMutation> {
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * Contains the data type of the entity. Must be one of supported types or may
   * represent complex type - which is JSON object that can be automatically converted
   * to the set of basic types.
   *
   * @generated from field: io.evitadb.externalApi.grpc.generated.GrpcEvitaAssociatedDataDataType.GrpcEvitaDataType type = 2;
   */
  type = GrpcEvitaAssociatedDataDataType_GrpcEvitaDataType.STRING;

  constructor(data?: PartialMessage<GrpcModifyAssociatedDataSchemaTypeMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcModifyAssociatedDataSchemaTypeMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "type", kind: "enum", T: proto3.getEnumType(GrpcEvitaAssociatedDataDataType_GrpcEvitaDataType) },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcModifyAssociatedDataSchemaTypeMutation {
    return new GrpcModifyAssociatedDataSchemaTypeMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcModifyAssociatedDataSchemaTypeMutation {
    return new GrpcModifyAssociatedDataSchemaTypeMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcModifyAssociatedDataSchemaTypeMutation {
    return new GrpcModifyAssociatedDataSchemaTypeMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcModifyAssociatedDataSchemaTypeMutation | PlainMessage<GrpcModifyAssociatedDataSchemaTypeMutation> | undefined, b: GrpcModifyAssociatedDataSchemaTypeMutation | PlainMessage<GrpcModifyAssociatedDataSchemaTypeMutation> | undefined): boolean {
    return proto3.util.equals(GrpcModifyAssociatedDataSchemaTypeMutation, a, b);
  }
}

/**
 * Mutation is responsible for removing an existing `AssociatedDataSchema` in the `EntitySchema`.
 * Mutation can be used for altering also the existing `AssociatedDataSchema` alone.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcRemoveAssociatedDataSchemaMutation
 */
export class GrpcRemoveAssociatedDataSchemaMutation extends Message<GrpcRemoveAssociatedDataSchemaMutation> {
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   * @generated from field: string name = 1;
   */
  name = "";

  constructor(data?: PartialMessage<GrpcRemoveAssociatedDataSchemaMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcRemoveAssociatedDataSchemaMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcRemoveAssociatedDataSchemaMutation {
    return new GrpcRemoveAssociatedDataSchemaMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcRemoveAssociatedDataSchemaMutation {
    return new GrpcRemoveAssociatedDataSchemaMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcRemoveAssociatedDataSchemaMutation {
    return new GrpcRemoveAssociatedDataSchemaMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcRemoveAssociatedDataSchemaMutation | PlainMessage<GrpcRemoveAssociatedDataSchemaMutation> | undefined, b: GrpcRemoveAssociatedDataSchemaMutation | PlainMessage<GrpcRemoveAssociatedDataSchemaMutation> | undefined): boolean {
    return proto3.util.equals(GrpcRemoveAssociatedDataSchemaMutation, a, b);
  }
}

/**
 * Mutation is responsible for setting value to a `AssociatedDataSchema.localized` in `EntitySchema`.
 * Mutation can be used for altering also the existing `AssociatedDataSchema` alone.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcSetAssociatedDataSchemaLocalizedMutation
 */
export class GrpcSetAssociatedDataSchemaLocalizedMutation extends Message<GrpcSetAssociatedDataSchemaLocalizedMutation> {
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * Localized associated data has to be ALWAYS used in connection with specific `locale`. In other
   * words - it cannot be stored unless associated locale is also provided.
   *
   * @generated from field: bool localized = 2;
   */
  localized = false;

  constructor(data?: PartialMessage<GrpcSetAssociatedDataSchemaLocalizedMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcSetAssociatedDataSchemaLocalizedMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "localized", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcSetAssociatedDataSchemaLocalizedMutation {
    return new GrpcSetAssociatedDataSchemaLocalizedMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcSetAssociatedDataSchemaLocalizedMutation {
    return new GrpcSetAssociatedDataSchemaLocalizedMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcSetAssociatedDataSchemaLocalizedMutation {
    return new GrpcSetAssociatedDataSchemaLocalizedMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcSetAssociatedDataSchemaLocalizedMutation | PlainMessage<GrpcSetAssociatedDataSchemaLocalizedMutation> | undefined, b: GrpcSetAssociatedDataSchemaLocalizedMutation | PlainMessage<GrpcSetAssociatedDataSchemaLocalizedMutation> | undefined): boolean {
    return proto3.util.equals(GrpcSetAssociatedDataSchemaLocalizedMutation, a, b);
  }
}

/**
 * Mutation is responsible for setting value to a `AssociatedDataSchema.nullable` in `EntitySchema`.
 * Mutation can be used for altering also the existing `AssociatedDataSchema` alone.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcSetAssociatedDataSchemaNullableMutation
 */
export class GrpcSetAssociatedDataSchemaNullableMutation extends Message<GrpcSetAssociatedDataSchemaNullableMutation> {
  /**
   * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another
   * within single entity instance.
   *
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * When associated data is nullable, its values may be missing in the entities. Otherwise, the system will enforce
   * non-null checks upon upserting of the entity.
   *
   * @generated from field: bool nullable = 2;
   */
  nullable = false;

  constructor(data?: PartialMessage<GrpcSetAssociatedDataSchemaNullableMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcSetAssociatedDataSchemaNullableMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "nullable", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcSetAssociatedDataSchemaNullableMutation {
    return new GrpcSetAssociatedDataSchemaNullableMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcSetAssociatedDataSchemaNullableMutation {
    return new GrpcSetAssociatedDataSchemaNullableMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcSetAssociatedDataSchemaNullableMutation {
    return new GrpcSetAssociatedDataSchemaNullableMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcSetAssociatedDataSchemaNullableMutation | PlainMessage<GrpcSetAssociatedDataSchemaNullableMutation> | undefined, b: GrpcSetAssociatedDataSchemaNullableMutation | PlainMessage<GrpcSetAssociatedDataSchemaNullableMutation> | undefined): boolean {
    return proto3.util.equals(GrpcSetAssociatedDataSchemaNullableMutation, a, b);
  }
}
