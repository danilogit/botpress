import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'

import Plots from './plots'

const Scatter: FC<any> = props => {
  const [scatEmb, setScatEmb] = useState([])

  useEffect(() => {
    async function scatterEmbeddings() {
      const { data } = await props.bp.axios.get('/mod/nlu-testing/scatterEmbeddings', { timeout: 0 })
      setScatEmb(data)
    }
    scatterEmbeddings()
  }, [props.dataLoaded])

  if (!props.dataLoaded) {
    return <h3>Please wait for the data to be embeded</h3>
  } else {
    return <Plots data={scatEmb} title={'Dimensionality reduction and scatter of intents embeddings'} />
  }
}
export default Scatter