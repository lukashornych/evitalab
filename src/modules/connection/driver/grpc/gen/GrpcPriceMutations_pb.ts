// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file GrpcPriceMutations.proto (package io.evitadb.externalApi.grpc.generated, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Int32Value, Message, proto3 } from "@bufbuild/protobuf";
import { GrpcPriceInnerRecordHandling } from "./GrpcEnums_pb.js";
import { GrpcBigDecimal, GrpcCurrency, GrpcDateTimeRange } from "./GrpcEvitaDataTypes_pb.js";

/**
 * This mutation allows to set / remove `priceInnerRecordHandling` behaviour of the entity.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcSetPriceInnerRecordHandlingMutation
 */
export class GrpcSetPriceInnerRecordHandlingMutation extends Message<GrpcSetPriceInnerRecordHandlingMutation> {
  /**
   * Price inner record handling controls how prices that share same `inner entity id` will behave during filtering and sorting.
   *
   * @generated from field: io.evitadb.externalApi.grpc.generated.GrpcPriceInnerRecordHandling priceInnerRecordHandling = 1;
   */
  priceInnerRecordHandling = GrpcPriceInnerRecordHandling.NONE;

  constructor(data?: PartialMessage<GrpcSetPriceInnerRecordHandlingMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcSetPriceInnerRecordHandlingMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "priceInnerRecordHandling", kind: "enum", T: proto3.getEnumType(GrpcPriceInnerRecordHandling) },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcSetPriceInnerRecordHandlingMutation {
    return new GrpcSetPriceInnerRecordHandlingMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcSetPriceInnerRecordHandlingMutation {
    return new GrpcSetPriceInnerRecordHandlingMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcSetPriceInnerRecordHandlingMutation {
    return new GrpcSetPriceInnerRecordHandlingMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcSetPriceInnerRecordHandlingMutation | PlainMessage<GrpcSetPriceInnerRecordHandlingMutation> | undefined, b: GrpcSetPriceInnerRecordHandlingMutation | PlainMessage<GrpcSetPriceInnerRecordHandlingMutation> | undefined): boolean {
    return proto3.util.equals(GrpcSetPriceInnerRecordHandlingMutation, a, b);
  }
}

/**
 * This mutation allows to create / update `price` of the entity.
 *
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcUpsertPriceMutation
 */
export class GrpcUpsertPriceMutation extends Message<GrpcUpsertPriceMutation> {
  /**
   * Contains identification of the price in the external systems. This id is expected to be used for the synchronization
   * of the price in relation with the primary source of the prices.
   *
   * This id is used to uniquely find a price within same price list and currency and is mandatory.
   *
   * @generated from field: int32 priceId = 1;
   */
  priceId = 0;

  /**
   * Contains identification of the price list in the external system. Each price must reference a price list. Price list
   * identification may refer to another Evita entity or may contain any external price list identification
   * (for example id or unique name of the price list in the external system).
   *
   * Single entity is expected to have single price for the price list unless there is `validity` specified.
   * In other words there is no sense to have multiple concurrently valid prices for the same entity that have roots
   * in the same price list.
   *
   * @generated from field: string priceList = 2;
   */
  priceList = "";

  /**
   * Identification of the currency. Three-letter form according to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   * @generated from field: io.evitadb.externalApi.grpc.generated.GrpcCurrency currency = 3;
   */
  currency?: GrpcCurrency;

  /**
   * Some special products (such as master products, or product sets) may contain prices of all "subordinate" products
   * so that the aggregating product can represent them in certain views on the product. In that case there is need
   * to distinguish the projected prices of the subordinate product in the one that represents them.
   *
   * Inner record id must contain positive value.
   *
   * @generated from field: google.protobuf.Int32Value innerRecordId = 4;
   */
  innerRecordId?: number;

  /**
   * Price without tax.
   *
   * @generated from field: io.evitadb.externalApi.grpc.generated.GrpcBigDecimal priceWithoutTax = 5;
   */
  priceWithoutTax?: GrpcBigDecimal;

  /**
   * Tax rate percentage (i.e. for 19% it'll be 19.00)
   *
   * @generated from field: io.evitadb.externalApi.grpc.generated.GrpcBigDecimal taxRate = 6;
   */
  taxRate?: GrpcBigDecimal;

  /**
   * Price with tax.
   *
   * @generated from field: io.evitadb.externalApi.grpc.generated.GrpcBigDecimal priceWithTax = 7;
   */
  priceWithTax?: GrpcBigDecimal;

  /**
   * Date and time interval for which the price is valid (inclusive).
   *
   * @generated from field: io.evitadb.externalApi.grpc.generated.GrpcDateTimeRange validity = 8;
   */
  validity?: GrpcDateTimeRange;

  /**
   * Controls whether price is subject to filtering / sorting logic, non-sellable prices will be fetched along with
   * entity but won't be considered when evaluating search query. These prices may be
   * used for "informational" prices such as reference price (the crossed out price often found on e-commerce sites
   * as "usual price") but are not considered as the "selling" price.
   *
   * @generated from field: bool sellable = 9;
   */
  sellable = false;

  constructor(data?: PartialMessage<GrpcUpsertPriceMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcUpsertPriceMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "priceId", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "priceList", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "currency", kind: "message", T: GrpcCurrency },
    { no: 4, name: "innerRecordId", kind: "message", T: Int32Value },
    { no: 5, name: "priceWithoutTax", kind: "message", T: GrpcBigDecimal },
    { no: 6, name: "taxRate", kind: "message", T: GrpcBigDecimal },
    { no: 7, name: "priceWithTax", kind: "message", T: GrpcBigDecimal },
    { no: 8, name: "validity", kind: "message", T: GrpcDateTimeRange },
    { no: 9, name: "sellable", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcUpsertPriceMutation {
    return new GrpcUpsertPriceMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcUpsertPriceMutation {
    return new GrpcUpsertPriceMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcUpsertPriceMutation {
    return new GrpcUpsertPriceMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcUpsertPriceMutation | PlainMessage<GrpcUpsertPriceMutation> | undefined, b: GrpcUpsertPriceMutation | PlainMessage<GrpcUpsertPriceMutation> | undefined): boolean {
    return proto3.util.equals(GrpcUpsertPriceMutation, a, b);
  }
}

/**
 * @generated from message io.evitadb.externalApi.grpc.generated.GrpcRemovePriceMutation
 */
export class GrpcRemovePriceMutation extends Message<GrpcRemovePriceMutation> {
  /**
   * Contains identification of the price in the external systems. This id is expected to be used for the synchronization
   * of the price in relation with the primary source of the prices.
   *
   * This id is used to uniquely find a price within same price list and currency and is mandatory.
   *
   * @generated from field: int32 priceId = 1;
   */
  priceId = 0;

  /**
   * Contains identification of the price list in the external system. Each price must reference a price list. Price list
   * identification may refer to another Evita entity or may contain any external price list identification
   * (for example id or unique name of the price list in the external system).
   *
   * Single entity is expected to have single price for the price list unless there is `validity` specified.
   * In other words there is no sense to have multiple concurrently valid prices for the same entity that have roots
   * in the same price list.
   *
   * @generated from field: string priceList = 2;
   */
  priceList = "";

  /**
   * Identification of the currency. Three-letter form according to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).
   *
   * @generated from field: io.evitadb.externalApi.grpc.generated.GrpcCurrency currency = 3;
   */
  currency?: GrpcCurrency;

  constructor(data?: PartialMessage<GrpcRemovePriceMutation>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "io.evitadb.externalApi.grpc.generated.GrpcRemovePriceMutation";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "priceId", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "priceList", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "currency", kind: "message", T: GrpcCurrency },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GrpcRemovePriceMutation {
    return new GrpcRemovePriceMutation().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GrpcRemovePriceMutation {
    return new GrpcRemovePriceMutation().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GrpcRemovePriceMutation {
    return new GrpcRemovePriceMutation().fromJsonString(jsonString, options);
  }

  static equals(a: GrpcRemovePriceMutation | PlainMessage<GrpcRemovePriceMutation> | undefined, b: GrpcRemovePriceMutation | PlainMessage<GrpcRemovePriceMutation> | undefined): boolean {
    return proto3.util.equals(GrpcRemovePriceMutation, a, b);
  }
}

