


// import { EdgeDefinition, EdgeDefinitionWithTranforms, PlanDefinition } from './Types';
// import Runtime from './Runtime';
// import Particiation from './systems/Participation';
// import TestSystem from './systems/testSystem';



// const plan1 = function () {
//     var nodes = {
//         participation: new Particiation(),
//         test: new TestSystem()
//     };
//     var edges = function (n = nodes) {
//         return [
//             new EdgeDefinitionWithTranforms(n.participation.pay, () => "ahah", n.test.test)
//         ]
//     }
//     return { nodes, edges }
// }

// const r = new Runtime();
// const plan = plan1();
// var p = r.track(plan as unknown as PlanDefinition);

// plan.nodes.participation.pay({userId:"2", participation:3, card:"qsdfqsdf"})