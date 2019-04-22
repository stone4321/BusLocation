/**
 * @fileoverview �ٶȵ�ͼAPI�¼���װ��
 * �˴����ʹ��closure compiler��advancedģʽ����ѹ��
 * @author Baidu Map Api Group 
 * @version 1.2
 */
/** 
 * @namespace BMap������library�������BMapLib�����ռ���
 */
var BMapLib = window.BMapLib || {};
/**
 * �¼���װ���ľ�̬�࣬����ʵ����
 * @class EventWrapper
 */
BMapLib.EventWrapper = window.BMapLib.EventWrapper || {};
(function(){

//var EventWrapper = window.BMapLib.EventWrapper;
/**
 * ���DOM�¼���������
 * @param {HTMLElement} element DOMԪ��
 * @param {String} event �¼�����
 * @param {Function} handler �¼�������
 * @returns {MapsEventListener} �¼���������
 */
BMapLib.EventWrapper.addDomListener = function(instance, eventName, handler) {
    if (instance.addEventListener) {
        instance.addEventListener(eventName, handler, false);
    }
    else if (instance.attachEvent) {
        instance.attachEvent('on' + eventName, handler);
    }
    else {
        instance['on' + eventName] = handler;
    }
    return new MapsEventListener(instance, eventName, handler, MapsEventListener.DOM_EVENT);
};
/**
 * ���DOM�¼�����������������ִ��һ��
 * @param {HTMLElement} element DOMԪ��
 * @param {String} event �¼�����
 * @param {Function} handler �¼�������
 * @returns {MapsEventListener} �¼���������
 */
BMapLib.EventWrapper.addDomListenerOnce = function(instance, eventName, handler) {
    var eventListener = EventWrapper['addDomListener'](instance, eventName, function(){
        // �Ƴ�
        EventWrapper['removeListener'](eventListener);
        return handler.apply(this, arguments);
    });
    return eventListener;
};
/**
 * ��ӵ�ͼ�¼���������
 * @param {Object} instance ʵ��
 * @param {String} event �¼�����
 * @param {Function} handler �¼�������
 * @returns {MapsEventListener} �¼���������
 */
BMapLib.EventWrapper.addListener = function(instance, eventName, handler) {
    instance.addEventListener(eventName, handler);
    return new MapsEventListener(instance, eventName, handler, MapsEventListener.MAP_EVENT);
};
/**
 * ��ӵ�ͼ�¼�����������������ִ��һ��
 * @param {Object} instance ��Ҫ������ʵ��
 * @param {String} event �¼�����
 * @param {Function} handler �¼�������
 * @returns {MapsEventListener} �¼���������
 */
BMapLib.EventWrapper.addListenerOnce = function(instance, eventName, handler){
    var eventListener = EventWrapper['addListener'](instance, eventName, function(){
        // �Ƴ�
        EventWrapper['removeListener'](eventListener);
        return handler.apply(this, arguments);
    });
    return eventListener;
};
/**
 * �Ƴ��ض�ʵ���������¼������м�������
 * @param {Object} instance ��Ҫ�Ƴ������¼�������ʵ��
 * @returns {None}
 */
BMapLib.EventWrapper.clearInstanceListeners = function(instance) {
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        EventWrapper['removeListener'](listeners[i]);
    }
    instance._e_ = {};
};
/**
 * �Ƴ��ض�ʵ���ض��¼������м�������
 * @param {Object} instance ��Ҫ�Ƴ��ض��¼�������ʵ��
 * @param {String} event ��Ҫ�Ƴ����¼���
 * @returns {None}
 */
BMapLib.EventWrapper.clearListeners = function(instance, eventName) {
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        if (listeners[i]._eventName == eventName) {
            EventWrapper['removeListener'](listeners[i]);
        }
    }
};
/**
 * �Ƴ��ض����¼���������
 * @param {MapsEventListener} listener ��Ҫ�Ƴ����¼���������
 * @returns {None}
 */
BMapLib.EventWrapper.removeListener = function(listener) {
    var instance = listener._instance;
    var eventName = listener._eventName;
    var handler = listener._handler;
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        if (listeners[i]._guid == listener._guid) {
            if (listener._eventType == MapsEventListener.DOM_EVENT) {
                // DOM�¼�
                if (instance.removeEventListener) {
                    instance.removeEventListener(eventName, handler, false);
                }
                else if (instance.detachEvent) {
                    instance.detachEvent('on' + eventName, handler);
                }
                else {
                    instance['on' + eventName] = null;
                }
            }
            else if (listener._eventType == MapsEventListener.MAP_EVENT) {
                // ��ͼ�¼�
                instance.removeEventListener(eventName, handler);
            }
            delete listeners[i];
        }
    }
};
/**
 * �����ض��¼�
 * @param {Object} instance �����¼���ʵ������
 * @param {String} event �����¼�������
 * @param {Object} args �Զ����¼���������ѡ
 * @returns {None}
 */
BMapLib.EventWrapper.trigger = function(instance, eventName) {
    var listeners = instance._e_ || {};
    for (var i in listeners) {
        if (listeners[i]._eventName == eventName) {
            var args = Array.prototype.slice.call(arguments, 2);
            listeners[i]._handler.apply(instance, args);
        }
    }
};

/**
 * �¼�������
 * @constructor
 * @ignore
 * @private
 * @param {Object} ����ʵ��
 * @param {string} �¼�����
 * @param {Function} �¼���������
 * @param {EventTypes} �¼�����
 */
function MapsEventListener(instance, eventName, handler, eventType){
    this._instance = instance;
    this._eventName = eventName;
    this._handler = handler;
    this._eventType = eventType;
    this._guid = MapsEventListener._guid ++;
    this._instance._e_ = this._instance._e_ || {};
    this._instance._e_[this._guid] = this;
}
MapsEventListener._guid = 1;

MapsEventListener.DOM_EVENT = 1;
MapsEventListener.MAP_EVENT = 2;

})();