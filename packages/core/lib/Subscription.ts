import { Map } from "immutable";
import { v1 as uuidv1 } from "uuid";
import debugModule from "debug";

const debug = new debugModule("flok:core:subscription");

interface SubscriptionType {
  id: string;
  topic: string;
  clientId: string;
  type: string;
}

class Subscription {
  subscriptions: Map<string, SubscriptionType>;

  constructor() {
    this.subscriptions = Map();
  }

  /**
   * Return subsciption
   * @param id
   */
  get(id: string): SubscriptionType {
    return this.subscriptions.get(id);
  }

  /**
   * Add new subscription
   * @param topic
   * @param clientId
   * @param type
   * @returns {*}
   */
  add(topic: string, clientId: string, type: string = "ws"): string {
    // need to find subscription with same type = 'ws'

    const findSubscriptionWithClientId = this.subscriptions.find(
      (sub) =>
        sub.clientId === clientId && sub.type === type && sub.topic === topic
    );

    if (findSubscriptionWithClientId) {
      // exist and no need add more subscription
      return findSubscriptionWithClientId.id;
    }
    const id = this.autoId();
    const subscription: SubscriptionType = {
      id,
      topic,
      clientId,
      type,
    };

    debug("New subscription:", subscription.clientId, "->", subscription.topic);
    this.subscriptions = this.subscriptions.set(id, subscription);
    return id;
  }

  /**
   * Remove a subscription
   * @param id
   */
  remove(id: string) {
    debug("Remove subscription:", this.subscriptions.get(id));
    this.subscriptions = this.subscriptions.remove(id);
  }

  /**
   * Clear all subscriptions
   */
  clear() {
    debug("Clear all subscriptions");
    this.subscriptions = this.subscriptions.clear();
  }

  /**
   * Get Subscriptions
   * @param predicate
   * @returns Map<string, SubscriptionType>
   */
  getSubscriptions(
    predicate: (
      value: SubscriptionType,
      key: string,
      iter: Map<string, SubscriptionType>
    ) => boolean = null
  ): Map<string, SubscriptionType> {
    return predicate
      ? this.subscriptions.filter(predicate)
      : this.subscriptions;
  }

  /**
   * Generate new ID
   * @returns {*}
   */
  autoId(): string {
    return uuidv1();
  }
}

export default Subscription;
