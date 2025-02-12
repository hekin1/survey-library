import { Component, ComponentRef, Type, ViewContainerRef } from "@angular/core";

export class AngularComponentFactory {
  public static Instance: AngularComponentFactory = new AngularComponentFactory();
  private creatorHash: { [index: string]: Type<any> } = {};

  public registerComponent(
    typeName: string,
    componentType: Type<any>
  ): void {
    this.creatorHash[typeName] = componentType;
  }
  public getAllTypes(): Array<string> {
    var result = new Array<string>();
    for (var key in this.creatorHash) {
      result.push(key);
    }
    return result.sort();
  }
  public isComponentRegistered(elementType: string): boolean {
    return !!this.creatorHash[elementType];
  }
  public create(containerRef: ViewContainerRef, elementType: string, params?: any): ComponentRef<Component> {
    var componentType = this.creatorHash[elementType];
    if (!componentType) return (null as any);
    return containerRef.createComponent(componentType);
  }
}
