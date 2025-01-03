const c = require('./../schemas')

const CourseSchema = c.object({ title: 'Course', required: ['name'] })
c.extendNamedProperties(CourseSchema) // name first

_.extend(CourseSchema.properties, {
  i18n: { type: 'object', title: 'i18n', format: 'i18n', props: ['name', 'description'] },
  campaignID: c.objectId(),
  concepts: c.array({ title: 'Programming Concepts', uniqueItems: true }, c.concept),
  description: { type: 'string' },
  duration: {
    oneOf: [
      {
        type: 'object',
        title: 'Course duration',
        properties: {
          total: { type: 'string', title: 'Total class time (overall)' },
          inGame: { type: 'string', title: 'In-game time' },
          totalTimeRange: { type: 'string', title: 'Total class time (range)', description: 'Relevant for curriculum guides hover tooltip' },
          i18n: {
            type: 'object',
            title: 'i18n',
            format: 'i18n',
            props: [
              'total', 'inGame', 'totalTimeRange',
            ],
          },
        },
      },
      { type: 'number', description: 'Approximate hours of content' }, // deprecated
    ],
  },
  pricePerSeat: { type: 'number', description: 'Price per seat in USD cents.' }, // deprecated
  free: { type: 'boolean' },
  screenshot: {
    oneOf: [
      { type: 'string', format: 'image-file', title: 'Thumbnail image', description: 'Relevant for teacher dashboard', pattern: /^db.*/ },
      c.path({ title: 'URL', description: 'Link to course screenshot.' }), // deprecated
    ],
  },
  adminOnly: { type: 'boolean', description: 'Deprecated in favor of releasePhase.' },
  releasePhase: { enum: ['beta', 'internalRelease', 'released'], description: "How far along the course's development is, determining who sees it." },
  isOzaria: { type: 'boolean', description: 'Is this an ozaria course' }, // not used
  shortName: { type: 'string', title: 'Short Name', description: 'Short name to be used on dashboards' },
  cstaStandards: c.array({ title: 'CSTA standards', description: 'Sample CSTA standards list for display on teacher dashboard curriculum guides' }, {
    type: 'object',
    title: 'CSTA standard',
    properties: {
      name: { type: 'string', title: 'Name' },
      description: { type: 'string', title: 'Description' },
      i18n: {
        type: 'object',
        title: 'i18n',
        format: 'i18n',
        props: [
          'name', 'description',
        ],
      },
    },
  }),
  modules: {
    title: 'Modules',
    type: 'object',
    description: 'Module information to be shown on the curriculum guide. Please use module number as key field.',
    additionalProperties:
    {
      type: 'object',
      title: 'Module',
      description: 'Relevant for information displayed on curriculum guides in teacher dashboard for each module',
      default: { access: 'paid' },
      properties: {
        number: { anyOf: [{ type: 'number', title: 'Module number' }, { type: 'string', title: 'Module number string' }], title: 'Module number', description: '(like 1, 2, 3, or A1, A2, B1)' },
        duration: {
          type: 'object',
          title: 'Module duration',
          properties: {
            total: { type: 'string', title: 'Total class time (overall)' },
            inGame: { type: 'string', title: 'In-game time' },
            totalTimeRange: { type: 'string', title: 'Total class time (range)', description: 'Relevant for curriculum guides hover tooltip' },
            i18n: {
              type: 'object',
              title: 'i18n',
              format: 'i18n',
              props: ['total', 'inGame', 'totalTimeRange'],
            },
          },
        },
        lessonSlidesUrl: {
          title: 'Lesson Slides URLs',
          oneOf: [
            c.url({ title: 'Lesson Slides URL' }),
            {
              type: 'object',
              title: 'Lesson Slides URLs by Language',
              additionalProperties: c.url(),
              format: 'code-languages-object',
            },
          ],
        },
        concepts: c.array({ title: 'Programming Concepts', uniqueItems: true }, c.concept),
        primaryConcepts: c.array({ title: 'Primary Concepts', description: 'The main 1-3 concepts this module focuses on.', uniqueItems: true, inEditor: true }, c.concept),
        name: c.shortString({ title: 'Module Name' }),
        access: { type: 'string', enum: ['free', 'sales-call', 'paid'], title: 'Access', description: 'Whether this module is free, free with a sales call, or paid.' },
        i18n: {
          type: 'object',
          title: 'i18n',
          format: 'i18n',
          props: ['name', 'lessonSlidesUrl'],
        },
      },
    },
  },
})

c.extendBasicProperties(CourseSchema, 'Course')
c.extendTranslationCoverageProperties(CourseSchema)
c.extendPatchableProperties(CourseSchema)
c.extendSearchableProperties(CourseSchema)

module.exports = CourseSchema
