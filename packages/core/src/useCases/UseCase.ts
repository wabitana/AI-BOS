/**
 * Standard UseCase interface representing an Application-layer command.
 */
export interface UseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}
