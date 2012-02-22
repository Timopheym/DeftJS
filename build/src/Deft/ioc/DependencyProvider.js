/*
 * DeftJS v0.1.0
 * Copyright (c) 2012 DeftJS Framework Contributors
 * Open source under the MIT License.
 */

/**
@private

Used by {@link Deft.ioc.Injector}.
*/
Ext.define('Deft.ioc.DependencyProvider', {
  config: {
    identifier: null,
    /**
    		Class to be instantiated, by either full name, alias or alternate name, to resolve this dependency.
    */
    className: null,
    /**
    		Optional arguments to pass to the class' constructor when instantiating a class to resolve this dependency.
    */
    parameters: null,
    /**
    		Factory function to be executed to obtain the corresponding object instance or value to resolve this dependency.
    		
    		NOTE: For lazily instantiated dependencies, this function will be passed the object instance for which the dependency is being resolved.
    */
    fn: null,
    /**
    		Value to use to resolve this dependency.
    */
    value: null,
    /**
    		Indicates whether this dependency should be resolved as a singleton, or as a transient value for each resolution request.
    */
    singleton: true,
    /**
    		Indicates whether this dependency should be 'eagerly' instantiated when this provider is defined, rather than 'lazily' instantiated when later requested.
    		
    		NOTE: Only valid when either a factory function or class is specified as a singleton.
    */
    eager: false
  },
  constructor: function(config) {
    this.initConfig(config);
    if (this.getEager()) {
      if (this.getValue() != null) {
        Ext.Error.raise("Error while configuring '" + (this.getIndentifier()) + "': a 'value' cannot be created eagerly.");
      }
      if (!this.getSingleton()) {
        Ext.Error.raise("Error while configuring '" + (this.getIndentifier()) + "': only singletons can be created eagerly.");
      }
    }
    if (!this.getSingleton()) {
      if (this.getValue() != null) {
        Ext.Error.raise("Error while configuring '" + (this.getIndentifier()) + "': a 'value' can only be configured as a singleton.");
      }
    }
    return this;
  },
  /**
  	Resolve a target instance's dependency with an object instance or value generated by this dependency provider.
  */
  resolve: function(targetInstance) {
    var instance, parameters;
    Ext.log("Resolving '" + (this.getIdentifier()) + "'.");
    if (this.getValue() != null) return this.getValue();
    instance = null;
    if (this.getFn() != null) {
      Ext.log("Executing factory function.");
      instance = this.fn(targetInstance);
    } else if (this.getClassName() != null) {
      Ext.log("Creating instance of '" + (this.getClassName()) + "'.");
      parameters = this.getParameters() != null ? [this.getClassName()].concat(this.getParameters()) : [this.getClassName()];
      instance = Ext.create.apply(this, parameters);
    } else {
      Ext.Error.raise("Error while configuring rule for '" + (this.getIndentifier()) + "': no 'value', 'fn', or 'className' was specified.");
    }
    if (this.getSingleton()) this.setValue(instance);
    return instance;
  }
});
