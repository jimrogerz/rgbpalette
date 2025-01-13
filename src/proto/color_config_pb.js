// source: color_config.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() { return this || window || global || self || Function('return this')(); }).call(null);

goog.exportSymbol('proto.Color', null, global);
goog.exportSymbol('proto.ColorConfig', null, global);
goog.exportSymbol('proto.Distribution', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Color = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Color, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.Color.displayName = 'proto.Color';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ColorConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.ColorConfig.repeatedFields_, null);
};
goog.inherits(proto.ColorConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ColorConfig.displayName = 'proto.ColorConfig';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Color.prototype.toObject = function(opt_includeInstance) {
  return proto.Color.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Color} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Color.toObject = function(includeInstance, msg) {
  var f, obj = {
    index: jspb.Message.getFieldWithDefault(msg, 1, 0),
    hue: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    saturation: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Color}
 */
proto.Color.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Color;
  return proto.Color.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Color} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Color}
 */
proto.Color.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setIndex(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setHue(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setSaturation(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Color.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Color.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Color} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Color.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIndex();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getHue();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getSaturation();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
};


/**
 * optional int32 index = 1;
 * @return {number}
 */
proto.Color.prototype.getIndex = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.Color} returns this
 */
proto.Color.prototype.setIndex = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional float hue = 2;
 * @return {number}
 */
proto.Color.prototype.getHue = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.Color} returns this
 */
proto.Color.prototype.setHue = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional float saturation = 3;
 * @return {number}
 */
proto.Color.prototype.getSaturation = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.Color} returns this
 */
proto.Color.prototype.setSaturation = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.ColorConfig.repeatedFields_ = [10];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ColorConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.ColorConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ColorConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ColorConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    hueCount: jspb.Message.getFieldWithDefault(msg, 1, 0),
    proximity: jspb.Message.getFieldWithDefault(msg, 2, 0),
    hueOffset: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    saturation: jspb.Message.getFloatingPointFieldWithDefault(msg, 4, 0.0),
    scaleMin: jspb.Message.getFieldWithDefault(msg, 5, 0),
    scaleMax: jspb.Message.getFieldWithDefault(msg, 6, 0),
    scaleStep: jspb.Message.getFieldWithDefault(msg, 7, 0),
    distribution: jspb.Message.getFieldWithDefault(msg, 9, 0),
    colorsList: jspb.Message.toObjectList(msg.getColorsList(),
    proto.Color.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ColorConfig}
 */
proto.ColorConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ColorConfig;
  return proto.ColorConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ColorConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ColorConfig}
 */
proto.ColorConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setHueCount(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setProximity(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setHueOffset(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setSaturation(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setScaleMin(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setScaleMax(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setScaleStep(value);
      break;
    case 9:
      var value = /** @type {!proto.Distribution} */ (reader.readEnum());
      msg.setDistribution(value);
      break;
    case 10:
      var value = new proto.Color;
      reader.readMessage(value,proto.Color.deserializeBinaryFromReader);
      msg.addColors(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ColorConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ColorConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ColorConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ColorConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHueCount();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getProximity();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getHueOffset();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = message.getSaturation();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
  f = message.getScaleMin();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = message.getScaleMax();
  if (f !== 0) {
    writer.writeInt32(
      6,
      f
    );
  }
  f = message.getScaleStep();
  if (f !== 0) {
    writer.writeInt32(
      7,
      f
    );
  }
  f = message.getDistribution();
  if (f !== 0.0) {
    writer.writeEnum(
      9,
      f
    );
  }
  f = message.getColorsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      10,
      f,
      proto.Color.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 hue_count = 1;
 * @return {number}
 */
proto.ColorConfig.prototype.getHueCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.ColorConfig} returns this
 */
proto.ColorConfig.prototype.setHueCount = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 proximity = 2;
 * @return {number}
 */
proto.ColorConfig.prototype.getProximity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.ColorConfig} returns this
 */
proto.ColorConfig.prototype.setProximity = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional float hue_offset = 3;
 * @return {number}
 */
proto.ColorConfig.prototype.getHueOffset = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.ColorConfig} returns this
 */
proto.ColorConfig.prototype.setHueOffset = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional float saturation = 4;
 * @return {number}
 */
proto.ColorConfig.prototype.getSaturation = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 4, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.ColorConfig} returns this
 */
proto.ColorConfig.prototype.setSaturation = function(value) {
  return jspb.Message.setProto3FloatField(this, 4, value);
};


/**
 * optional int32 scale_min = 5;
 * @return {number}
 */
proto.ColorConfig.prototype.getScaleMin = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.ColorConfig} returns this
 */
proto.ColorConfig.prototype.setScaleMin = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional int32 scale_max = 6;
 * @return {number}
 */
proto.ColorConfig.prototype.getScaleMax = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.ColorConfig} returns this
 */
proto.ColorConfig.prototype.setScaleMax = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional int32 scale_step = 7;
 * @return {number}
 */
proto.ColorConfig.prototype.getScaleStep = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.ColorConfig} returns this
 */
proto.ColorConfig.prototype.setScaleStep = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * optional Distribution distribution = 9;
 * @return {!proto.Distribution}
 */
proto.ColorConfig.prototype.getDistribution = function() {
  return /** @type {!proto.Distribution} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/**
 * @param {!proto.Distribution} value
 * @return {!proto.ColorConfig} returns this
 */
proto.ColorConfig.prototype.setDistribution = function(value) {
  return jspb.Message.setProto3EnumField(this, 9, value);
};


/**
 * repeated Color colors = 10;
 * @return {!Array<!proto.Color>}
 */
proto.ColorConfig.prototype.getColorsList = function() {
  return /** @type{!Array<!proto.Color>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.Color, 10));
};


/**
 * @param {!Array<!proto.Color>} value
 * @return {!proto.ColorConfig} returns this
*/
proto.ColorConfig.prototype.setColorsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 10, value);
};


/**
 * @param {!proto.Color=} opt_value
 * @param {number=} opt_index
 * @return {!proto.Color}
 */
proto.ColorConfig.prototype.addColors = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 10, opt_value, proto.Color, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.ColorConfig} returns this
 */
proto.ColorConfig.prototype.clearColorsList = function() {
  return this.setColorsList([]);
};


/**
 * @enum {number}
 */
proto.Distribution = {
  DISTRIBUTION_UNSPECIFIED: 0,
  DISTRIBUTION_EQUAL: 1,
  DISTRIBUTION_NEAR: 2
};

goog.object.extend(exports, proto);
