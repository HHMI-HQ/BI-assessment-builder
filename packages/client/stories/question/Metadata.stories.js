/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */

import React, { useState, useEffect } from 'react'
import { Metadata, Checkbox } from 'ui'

import metadata from './_helpers/metadataValues'
import resources from './_helpers/resourcesData'

const initialValues = {
  topics: [
    {
      topic: 'genetics',
      subtopic: 'patternsOfInheritance',
    },
    {
      topic: 'cellBiology',
      subtopic: 'cellStructureFunction',
    },
  ],
  courses: [
    {
      course: 'apEnvironmentalScience',
      units: [
        {
          unit: 'populations',
          courseTopic: 'generalistAndSpecialistSpecies',
          learningObjective: 'ERT-3.A',
          essentialKnowledge: 'ERT-3.A.1',
        },
        {
          unit: 'theLivingWorldEcosystems',
          courseTopic: 'terrestrialBiomes',
          learningObjective: 'ERT-1.B',
          essentialKnowledge: 'ERT-1.B.2',
        },
      ],
    },
    {
      course: 'biEnvironmentalScience',
      units: [
        {
          unit: 'ecosystemsAndEcology',
          courseTopic: 'communitiesAndEcosystems',
          application: 'IBES-A2.2.3',
          understanding: 'IBES-U2.2.4',
        },
      ],
    },
  ],
  biointeractiveResources: [
    'biochemistryAndCellSignalingPathwayOfTheMc1rGene',
    'cysticFibrosisMechanismAndTreatment',
  ],
  cognitiveLevel: 'higher-understand',
}

export const Author = () => {
  const [flatMetadata, setFlatMetadata] = useState(metadata)

  useEffect(() => {
    const courseData = [...metadata.frameworks]

    const transformedCoursesData = []

    courseData.forEach(({ course, units }) => {
      if (units.length > 1) {
        units.forEach(unit => {
          transformedCoursesData.push({
            course,
            ...unit,
          })
        })
      } else {
        transformedCoursesData.push({
          course,
          ...units[0],
        })
      }
    })

    setFlatMetadata({
      ...metadata,
      courses: transformedCoursesData,
    })
  }, [])

  return (
    <Metadata
      metadata={flatMetadata}
      // readOnly
      onFormFinish={() => console.log('on form finish')}
      resources={resources}
    />
  )
}

export const Editor = args => {
  const [editable, setEditable] = useState(false)
  const [flatMetadata, setFlatMetadata] = useState(metadata)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const courseData = [...metadata.frameworks]

    const transformedCoursesData = []

    courseData.forEach(({ course, units }) => {
      if (units.length > 1) {
        units.forEach(unit => {
          transformedCoursesData.push({
            course,
            ...unit,
          })
        })
      } else {
        transformedCoursesData.push({
          course,
          ...units[0],
        })
      }
    })

    setFlatMetadata({
      ...metadata,
      courses: transformedCoursesData,
    })

    setReady(true)
  }, [])

  return (
    <>
      <Checkbox onChange={() => setEditable(!editable)}>Editable</Checkbox>
      {ready && (
        <Metadata
          {...args}
          editorView
          initialValues={initialValues}
          metadata={flatMetadata}
          onFormFinish={() => console.log('on form finish')}
          readOnly={!editable}
          resources={resources}
        />
      )}
    </>
  )
}

export default {
  component: Metadata,
  title: 'Question/Metadata',
}
