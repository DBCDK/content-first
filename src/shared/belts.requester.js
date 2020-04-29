export default class BeltsRequester {
  constructor({storageClient}) {
    this.storageClient = storageClient;
  }

  async fetchOwnedBelts(owner) {
    const belts = (
      await this.storageClient.find({
        type: 'belt',
        owner
      })
    ).data;

    return belts;
  }
}
