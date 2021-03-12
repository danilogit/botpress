import crypto from 'crypto'
import LRUCache from 'lru-cache'
import nluEngine from 'nlu/engine'

import { TrainingSession } from './typings_v1'

export default class TrainSessionService {
  private trainSessions: {
    [key: string]: TrainingSession
  } = {}

  // training sessions of this cache will eventually be kicked out so there's no memory leak
  private releasedTrainSessions = new LRUCache<string, TrainingSession>(1000)

  constructor() {}

  makeTrainingSession = (modelId: nluEngine.ModelId, password: string, language: string): TrainingSession => ({
    key: this._makeTrainSessionKey(modelId, password),
    status: 'training-pending',
    progress: 0,
    language
  })

  getTrainingSession(modelId: nluEngine.ModelId, password: string): TrainingSession | undefined {
    const key = this._makeTrainSessionKey(modelId, password)
    const ts = this.trainSessions[key]
    if (ts) {
      return ts
    }
    return this.releasedTrainSessions.get(key)
  }

  setTrainingSession(modelId: nluEngine.ModelId, password: string, trainSession: TrainingSession) {
    const key = this._makeTrainSessionKey(modelId, password)
    if (this.releasedTrainSessions.get(key)) {
      this.releasedTrainSessions.del(key)
    }
    this.trainSessions[key] = trainSession
  }

  releaseTrainingSession(modelId: nluEngine.ModelId, password: string): void {
    const key = this._makeTrainSessionKey(modelId, password)
    const ts = this.trainSessions[key]
    delete this.trainSessions[key]
    this.releasedTrainSessions.set(key, ts)
  }

  private _makeTrainSessionKey(modelId: nluEngine.ModelId, password: string) {
    const stringId = nluEngine.modelIdService.toString(modelId)
    return crypto
      .createHash('md5')
      .update(`${stringId}${password}`)
      .digest('hex')
  }
}
