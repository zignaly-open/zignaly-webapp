import { assert } from "chai";

/**
 */

/**
 * Position entity object structure standard assertions.
 *
 * @param {Position} positionEntity Position entity to check.
 * @return {Void} None.
 */
export function positionEntityStructureAssertions(positionEntity) {
  assert.isObject(positionEntity, "Position entity is not an object.");
  assert.isString(positionEntity.positionId, "Position entity positionId is not a string.");
  assert.isNumber(positionEntity.status, "Position entity status is not a number.");
  assert.isString(positionEntity.side, "Position entity side is not a string.");
  assert.isString(positionEntity.age, "Position entity age is not a string.");
  assert.isNumber(positionEntity.amount, "Position entity age is not a number.");
  assert.isNumber(positionEntity.buyPrice, "Position entity buyPrice is not a number.");
  assert.isNumber(positionEntity.buyTTL, "Position entity buyTTL is not a number.");
  assert.isBoolean(positionEntity.closed, "Position entity closed is not a boolean.");
  assert.isString(positionEntity.exchange, "Position entity exchange is not a string.");
  assert.isNumber(positionEntity.invested, "Position entity invested is not a number.");
  assert.isBoolean(positionEntity.isCopyTrader, "Position entity isCopyTrader is not a boolean.");
  assert.isBoolean(positionEntity.isCopyTrading, "Position entity isCopyTrading is not a boolean.");
  assert.isNumber(positionEntity.leverage, "Position entity leverage is not a number.");
  assert.isString(
    positionEntity.openDateReadable,
    "Position entity openDateReadable is not a string.",
  );
  assert.isString(
    positionEntity.closeDateReadable,
    "Position entity closeDateReadable is not a string.",
  );
  assert.match(
    typeof positionEntity.reBuyTargets,
    /object|boolean/,
    "Position entity reBuyTargets is not an object.",
  );
  assert.isString(positionEntity.signalId, "Position entity signalId is not a string.");
  assert.isNumber(positionEntity.realInvestment, "Position entity realInvestment is not a number.");
  assert.isNumber(positionEntity.sellPrice, "Position entity sellPrice is not a number.");
  assert.isString(positionEntity.symbol, "Position entity symbol is not a string.");
  assert.isString(positionEntity.type, "Position entity type is not a string.");
  assert.isBoolean(positionEntity.updating, "Position entity updating is not a boolean.");
  assert.isNumber(
    positionEntity.takeProfitTargetsCountFail,
    "Position entity takeProfitTargetsCountFail is not a number.",
  );
  assert.isNumber(
    positionEntity.takeProfitTargetsCountPending,
    "Position entity takeProfitTargetsCountPending is not a number.",
  );
  assert.isNumber(
    positionEntity.takeProfitTargetsCountSuccess,
    "Position entity takeProfitTargetsCountSuccess is not a number.",
  );
}
