import { GrpcSealedEntity } from "@/gen/GrpcEntity_pb";
import { GrpcEntityResponse } from "@/gen/GrpcEvitaSessionAPI_pb";
import { Entity } from "@/modules/connection/model/data/Entity";
import { UnexpectedError } from "@/modules/base/exception/UnexpectedError"

export class EntityConverter
{
    convert(entity: GrpcSealedEntity):Entity{
        throw new UnexpectedError("Not implemented");
    }
}
