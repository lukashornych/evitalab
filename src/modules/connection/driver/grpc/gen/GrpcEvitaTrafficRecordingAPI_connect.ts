// @generated by protoc-gen-connect-es v1.4.0 with parameter "target=ts"
// @generated from file GrpcEvitaTrafficRecordingAPI.proto (package io.evitadb.externalApi.grpc.generated, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { GetTrafficHistoryListRequest, GetTrafficHistoryListResponse, GetTrafficHistoryRequest, GetTrafficHistoryResponse, GetTrafficRecordingLabelNamesRequest, GetTrafficRecordingLabelNamesResponse, GetTrafficRecordingStatusResponse, GetTrafficRecordingValuesNamesRequest, GetTrafficRecordingValuesNamesResponse, GrpcStartTrafficRecordingRequest, GrpcStopTrafficRecordingRequest } from "./GrpcEvitaTrafficRecordingAPI_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service io.evitadb.externalApi.grpc.generated.GrpcEvitaTrafficRecordingService
 */
export const GrpcEvitaTrafficRecordingService = {
  typeName: "io.evitadb.externalApi.grpc.generated.GrpcEvitaTrafficRecordingService",
  methods: {
    /**
     * Procedure that returns requested list of past traffic records with limited size that match the request criteria.
     * Order of the returned records is from the oldest sessions to the newest,
     * traffic records within the session are ordered from the oldest to the newest.
     *
     * @generated from rpc io.evitadb.externalApi.grpc.generated.GrpcEvitaTrafficRecordingService.GetTrafficRecordingHistoryList
     */
    getTrafficRecordingHistoryList: {
      name: "GetTrafficRecordingHistoryList",
      I: GetTrafficHistoryListRequest,
      O: GetTrafficHistoryListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Procedure that returns requested list of past traffic records with limited size that match the request criteria.
     * Order of the returned records is from the newest sessions to the oldest,
     * traffic records within the session are ordered from the newest to the oldest.
     *
     * @generated from rpc io.evitadb.externalApi.grpc.generated.GrpcEvitaTrafficRecordingService.GetTrafficRecordingHistoryListReversed
     */
    getTrafficRecordingHistoryListReversed: {
      name: "GetTrafficRecordingHistoryListReversed",
      I: GetTrafficHistoryListRequest,
      O: GetTrafficHistoryListResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Procedure that returns stream of all past traffic records that match the request criteria.
     * Order of the returned records is from the newest sessions to the oldest,
     * traffic records within the session are ordered from the newest to the oldest.
     *
     * @generated from rpc io.evitadb.externalApi.grpc.generated.GrpcEvitaTrafficRecordingService.GetTrafficRecordingHistory
     */
    getTrafficRecordingHistory: {
      name: "GetTrafficRecordingHistory",
      I: GetTrafficHistoryRequest,
      O: GetTrafficHistoryResponse,
      kind: MethodKind.ServerStreaming,
    },
    /**
     * Procedure returns a list of top unique labels names ordered by cardinality of their values present in the traffic recording.
     *
     * @generated from rpc io.evitadb.externalApi.grpc.generated.GrpcEvitaTrafficRecordingService.GetTrafficRecordingLabelsNamesOrderedByCardinality
     */
    getTrafficRecordingLabelsNamesOrderedByCardinality: {
      name: "GetTrafficRecordingLabelsNamesOrderedByCardinality",
      I: GetTrafficRecordingLabelNamesRequest,
      O: GetTrafficRecordingLabelNamesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Procedure returns a list of top unique label values ordered by cardinality of their values present in the traffic recording.
     *
     * @generated from rpc io.evitadb.externalApi.grpc.generated.GrpcEvitaTrafficRecordingService.GetTrafficRecordingLabelValuesOrderedByCardinality
     */
    getTrafficRecordingLabelValuesOrderedByCardinality: {
      name: "GetTrafficRecordingLabelValuesOrderedByCardinality",
      I: GetTrafficRecordingValuesNamesRequest,
      O: GetTrafficRecordingValuesNamesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Procedure that starts the traffic recording for the given criteria and settings
     *
     * @generated from rpc io.evitadb.externalApi.grpc.generated.GrpcEvitaTrafficRecordingService.StartTrafficRecording
     */
    startTrafficRecording: {
      name: "StartTrafficRecording",
      I: GrpcStartTrafficRecordingRequest,
      O: GetTrafficRecordingStatusResponse,
      kind: MethodKind.Unary,
    },
    /**
     * Procedure that stops the traffic recording
     *
     * @generated from rpc io.evitadb.externalApi.grpc.generated.GrpcEvitaTrafficRecordingService.StopTrafficRecording
     */
    stopTrafficRecording: {
      name: "StopTrafficRecording",
      I: GrpcStopTrafficRecordingRequest,
      O: GetTrafficRecordingStatusResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

