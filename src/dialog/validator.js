import _ from 'lodash'

exports.validateFlowSchema = flow => {
  const errorPrefix = `[Flow] Invalid flow "${flow && flow.location}"`

  if (!flow || !_.isObjectLike(flow)) {
    return 'Invalid JSON flow schema'
  }

  if (!flow.version || !_.isString(flow.version)) {
    return `${errorPrefix}, expected valid version but found none`
  }

  if (!flow.version.startsWith('0.')) {
    return `${errorPrefix}, unsupported version of the schema "${flow.version}"`
  }

  if (!_.isString(flow.startNode)) {
    return `${errorPrefix}, expected valid 'startNode'`
  }

  if (!_.isArray(flow.nodes)) {
    return `${errorPrefix}, expected 'nodes' to be an array of nodes`
  }

  if (!_.find(flow.nodes, { name: flow.startNode })) {
    return `${errorPrefix}, expected 'startNode' to point to a valid node name`
  }

  if (flow.catchAll) {
    if (flow.catchAll.onEnter) {
      return `${errorPrefix}, "catchAll" does not support "onEnter"`
    }
  }

  for (let node of flow.nodes) {
    if (!_.isString(node.id) || node.id.length <= 3) {
      return errorPrefix + ', expected all nodes to have a valid id'
    }
  }
}
