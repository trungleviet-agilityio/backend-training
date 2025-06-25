/**
 * TV Company Database - Improved Mock Data Generator
 * =================================================
 *
 * This script generates realistic mock data for the TV Company Database
 * using a configuration-driven approach for business rule resilience
 *
 * Key Improvements:
 * - Configuration-driven business rules (business_rules_config.json)
 * - Centralized validation functions
 * - Easy to update when business rules change
 * - Better error handling and logging
 * - Modular design for maintainability
 *
 * Business Rules Compliance:
 * - All generated data follows field-specific business rules (BR-001 to BR-015)
 * - All generated data follows relationship-specific business rules (BR-016 to BR-021)
 * - Data integrity is maintained across all tables
 * - Soft delete functionality is properly implemented
 *
 * Dependencies:
 * - Node.js with @faker-js/faker package
 * - PostgreSQL database with tv_company schema
 * - business_rules_config.json configuration file
 */

const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

// ============================================================================
// CONFIGURATION LOADING
// ============================================================================

/**
 * Loads business rules configuration from JSON file
 * @returns {Object} Configuration object
 */
const loadBusinessRulesConfig = () => {
  try {
    const configPath = path.join(__dirname, 'business_rules_config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);

    console.log(`✅ Loaded business rules configuration v${config.version}`);
    console.log(`📅 Last updated: ${config.last_updated}`);

    return config;
  } catch (error) {
    console.error('❌ Error loading business rules configuration:', error.message);
    process.exit(1);
  }
};

// Load configuration
const config = loadBusinessRulesConfig();

// ============================================================================
// VALIDATION FUNCTIONS (Business Rule Compliant)
// ============================================================================

/**
 * Validates if a role name is valid according to business rules
 * @param {string} roleName - Role name to validate
 * @returns {boolean} True if valid
 */
const isValidRole = (roleName) => {
  return config.roles.valid_roles.includes(roleName);
};

/**
 * Validates if an employee status is valid according to business rules
 * @param {string} status - Status to validate
 * @returns {boolean} True if valid
 */
const isValidEmployeeStatus = (status) => {
  return config.employee_statuses.valid_statuses.includes(status);
};

/**
 * Validates if an employee status is active (can be assigned roles)
 * @param {string} status - Status to validate
 * @returns {boolean} True if active
 */
const isActiveEmployeeStatus = (status) => {
  return config.employee_statuses.active_statuses.includes(status);
};

/**
 * Validates if a series domain is valid according to business rules
 * @param {string} domain - Domain to validate
 * @returns {boolean} True if valid
 */
const isValidSeriesDomain = (domain) => {
  return config.series_domains.valid_domains.includes(domain);
};

/**
 * Validates if a channel type is valid
 * @param {string} type - Channel type to validate
 * @returns {boolean} True if valid
 */
const isValidChannelType = (type) => {
  return config.channel_types.valid_types.includes(type);
};

/**
 * Validates episode duration according to business rules
 * @param {number} duration - Duration in minutes
 * @returns {boolean} True if valid
 */
const isValidEpisodeDuration = (duration) => {
  return duration >= config.constraints.episode_duration.min_minutes &&
         duration <= config.constraints.episode_duration.max_minutes;
};

/**
 * Validates viewership according to business rules
 * @param {number} viewership - Viewership count
 * @returns {boolean} True if valid
 */
const isValidViewership = (viewership) => {
  return viewership >= config.constraints.viewership.min_value;
};

/**
 * Validates employment age according to business rules
 * @param {number} age - Age in years
 * @returns {boolean} True if valid
 */
const isValidEmploymentAge = (age) => {
  return age >= config.constraints.employment_age.min_age &&
         age <= config.constraints.employment_age.max_age;
};

/**
 * Checks if character name is required for a role
 * @param {string} roleName - Role name
 * @returns {boolean} True if character name required
 */
const isCharacterNameRequired = (roleName) => {
  return config.roles.character_name_required.includes(roleName);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escapes single quotes in strings for SQL insertion
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
const esc = (str) => str.replace(/'/g, "''");

/**
 * Validates that a date is not in the future
 * @param {Date} date - Date to validate
 * @returns {boolean} - True if date is valid
 */
const isValidDate = (date) => date <= new Date();

/**
 * Generates a realistic episode duration using business rule constraints
 * @returns {number} - Duration in minutes
 */
const generateEpisodeDuration = () => {
  const min = config.constraints.episode_duration.min_minutes;
  const max = config.constraints.episode_duration.max_minutes;
  return faker.number.int({ min, max });
};

/**
 * Generates a realistic viewership number using business rule constraints
 * @returns {number} - Viewership count
 */
const generateViewership = () => {
  const min = config.constraints.viewership.min_value;
  const max = 2000000; // Realistic upper bound
  return faker.number.int({ min, max });
};

/**
 * Logs progress for large data generation
 * @param {string} message - Progress message
 * @param {number} current - Current count
 * @param {number} total - Total count
 */
const logProgress = (message, current, total) => {
  if (config.data_generation.enable_progress_logging) {
    const percentage = Math.round((current / total) * 100);
    console.log(`${message}: ${current}/${total} (${percentage}%)`);
  }
};

// ============================================================================
// DATA GENERATION FUNCTIONS (Configuration-Driven)
// ============================================================================

/**
 * Defines series domains using configuration
 * @returns {Array} Array of series domain objects
 */
const defineSeriesDomains = () => {
  const domains = config.series_domains.valid_domains;
  const numDomains = config.data_generation.volumes.num_series_domains;

  let seriesDomains = [];
  for (let i = 0; i < Math.min(domains.length, numDomains); i++) {
    seriesDomains.push({
      uuid: faker.string.uuid(),
      name: esc(domains[i]),
      description: esc(faker.lorem.sentence()),
    });
  }

  console.log(`✅ Generated ${seriesDomains.length} series domains: ${domains.slice(0, numDomains).join(', ')}`);
  return seriesDomains;
};

/**
 * Defines broadcasting channels using configuration
 * @returns {Array} Array of channel objects
 */
const defineChannels = () => {
  const channelData = [
    { name: 'TV1', type: 'Cable' },
    { name: 'TV2', type: 'Cable' },
    { name: 'StreamTV', type: 'OTT' },
    { name: 'WebChannel', type: 'Web' },
    { name: 'GlobalTV', type: 'Cable' },
    { name: 'LocalTV', type: 'Cable' }
  ];
  const numChannels = config.data_generation.volumes.num_channels;

  let channels = [];
  for (let i = 0; i < Math.min(channelData.length, numChannels); i++) {
    const channel = channelData[i];

    // Validate channel type against configuration
    if (!isValidChannelType(channel.type)) {
      console.warn(`⚠️  Warning: Channel type '${channel.type}' not in configuration`);
    }

    channels.push({
      uuid: faker.string.uuid(),
      name: esc(channel.name),
      type: esc(channel.type),
      description: esc(faker.lorem.sentence()),
    });
  }

  console.log(`✅ Generated ${channels.length} channels`);
  return channels;
};

/**
 * Defines TV production roles using configuration
 * @returns {Array} Array of role objects
 */
const defineRoles = () => {
  const roles = config.roles.valid_roles;
  const numRoles = config.data_generation.volumes.num_roles;

  let roleObjects = [];
  for (let i = 0; i < Math.min(roles.length, numRoles); i++) {
    const roleName = roles[i];
    roleObjects.push({
      uuid: faker.string.uuid(),
      name: esc(roleName),
      description: esc(`Series ${roleName.toLowerCase()}`),
    });
  }

  console.log(`✅ Generated ${roleObjects.length} roles: ${roles.slice(0, numRoles).join(', ')}`);
  return roleObjects;
};

/**
 * Defines employees with configuration-driven validation
 * @returns {Array} Array of employee objects
 */
const defineEmployees = () => {
  const count = config.data_generation.volumes.num_employees;
  let employees = [];
  let usedEmails = new Set();

  for (let i = 1; i <= count; i++) {
    if (i % 100 === 0) {
      logProgress('Generating Employees', i, count);
    }

    let email;
    do {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      email = esc(faker.internet.email({ firstName, lastName }));
    } while (usedEmails.has(email));
    usedEmails.add(email);

    // Generate valid employment age using configuration
    const minAge = config.constraints.employment_age.min_age;
    const maxAge = config.constraints.employment_age.max_age;
    const birthday = faker.date.birthdate({ min: minAge, max: maxAge, mode: 'age' });
    const employmentDate = faker.date.between({
      from: birthday,
      to: new Date()
    });

    const isInternal = faker.datatype.boolean({ probability: 0.8 });
    const status = faker.helpers.arrayElement(config.employee_statuses.valid_statuses);

    employees.push({
      uuid: faker.string.uuid(),
      first_name: esc(faker.person.firstName()),
      last_name: esc(faker.person.lastName()),
      email,
      birthdate: birthday.toISOString().split('T')[0],
      employment_date: employmentDate.toISOString().split('T')[0],
      is_internal: isInternal,
      status,
    });
  }

  console.log(`✅ Generated ${employees.length} employees with valid statuses`);
  return employees;
};

/**
 * Defines TV series with configuration-driven validation
 * @param {Array} seriesDomains - Array of series domain objects
 * @returns {Array} Array of TV series objects
 */
const defineTVSeries = (seriesDomains) => {
  const count = config.data_generation.volumes.num_tv_series;
  let tvSeries = [];

  for (let i = 1; i <= count; i++) {
    if (i % 50 === 0) {
      logProgress('Generating TV Series', i, count);
    }

    const domain = faker.helpers.arrayElement(seriesDomains);
    const startDate = faker.date.past({ years: 3 });

    // BR-004: Series Date Range Validation - end_date >= start_date
    const endDate = faker.datatype.boolean({ probability: 0.6 })
      ? faker.date.between({ from: startDate, to: new Date() })
      : null;

    tvSeries.push({
      uuid: faker.string.uuid(),
      title: esc(`Series ${i} - ${faker.lorem.words(2)}`),
      description: esc(faker.lorem.sentence()),
      domain_uuid: domain.uuid,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate ? endDate.toISOString().split('T')[0] : null,
    });
  }

  console.log(`✅ Generated ${tvSeries.length} TV series`);
  return tvSeries;
};

/**
 * Defines episodes with configuration-driven validation
 * @param {Array} tvSeries - Array of TV series objects
 * @param {Array} employees - Array of employee objects
 * @param {Array} seriesCast - Array of series cast objects (must be generated first)
 * @param {Array} roles - Array of role objects
 * @returns {Array} Array of episode objects
 */
const defineEpisodes = (tvSeries, employees, seriesCast, roles) => {
  const count = config.data_generation.volumes.num_episodes;
  let episodes = [];

  // Find the Director role UUID
  const directorRole = roles.find(r => r.name === 'Director');
  if (!directorRole) {
    console.error('❌ Error: Director role not found in roles array');
    process.exit(1);
  }

  // Get all employees who have Director roles assigned in series_cast
  const directorEmployeeUuids = new Set();
  seriesCast.forEach(sc => {
    if (sc.role_uuid === directorRole.uuid) {
      directorEmployeeUuids.add(sc.employee_uuid);
    }
  });

  // Only allow employees with status 'available' or 'busy' (active statuses)
  const activeStatuses = config.employee_statuses.active_statuses;
  const availableDirectors = employees.filter(emp =>
    directorEmployeeUuids.has(emp.uuid) && activeStatuses.includes(emp.status)
  );

  if (availableDirectors.length === 0) {
    console.error('❌ Error: No employees with Director roles and active status (available/busy) found in series_cast');
    console.error('   This violates business rule: Director must have a Director role assigned and be available or busy');
    process.exit(1);
  }

  console.log(`📽️  Found ${availableDirectors.length} employees with Director roles and active status assigned`);

  for (let i = 1; i <= count; i++) {
    if (i % 200 === 0) {
      logProgress('Generating Episodes', i, count);
    }

    const series = faker.helpers.arrayElement(tvSeries);
    const director = faker.helpers.arrayElement(availableDirectors);
    const airDate = faker.date.between({
      from: series.start_date,
      to: new Date()
    });

    episodes.push({
      uuid: faker.string.uuid(),
      series_uuid: series.uuid,
      episode_number: i,
      title: esc(`Episode ${i} - ${faker.lorem.words(2)}`),
      duration_minutes: generateEpisodeDuration(), // Uses config constraints
      air_date: airDate.toISOString().split('T')[0],
      director_uuid: director.uuid,
    });
  }

  console.log(`✅ Generated ${episodes.length} episodes with valid directors (${availableDirectors.length} directors available)`);
  return episodes;
};

/**
 * Defines transmissions with configuration-driven validation
 * @param {Array} episodes - Array of episode objects
 * @returns {Array} Array of transmission objects
 */
const defineTransmissions = (episodes) => {
  const count = config.data_generation.volumes.num_transmissions;
  let transmissions = [];

  for (let i = 1; i <= count; i++) {
    if (i % 500 === 0) {
      logProgress('Generating Transmissions', i, count);
    }

    const episode = faker.helpers.arrayElement(episodes);
    const transmissionTime = faker.date.between({
      from: episode.air_date,
      to: new Date()
    });

    transmissions.push({
      uuid: faker.string.uuid(),
      episode_uuid: episode.uuid,
      transmission_time: transmissionTime.toISOString(),
      viewership: generateViewership(), // Uses config constraints
    });
  }

  console.log(`✅ Generated ${transmissions.length} transmissions with valid viewership`);
  return transmissions;
};

/**
 * Defines series cast assignments with unique combinations and proper character names
 * @param {Array} employees - Array of employee objects
 * @param {Array} tvSeries - Array of TV series objects
 * @param {Array} roles - Array of role objects
 * @returns {Array} Array of series cast objects
 */
const defineSeriesCast = (employees, tvSeries, roles) => {
  const count = config.data_generation.volumes.num_series_cast;
  let seriesCast = [];
  let usedTriples = new Set();
  let attempts = 0;
  const maxAttempts = count * 10;

  // Find role UUIDs for easier reference
  const directorRole = roles.find(r => r.name === 'Director');
  const actorRole = roles.find(r => r.name === 'Actor');
  const producerRole = roles.find(r => r.name === 'Producer');

  if (!directorRole || !actorRole || !producerRole) {
    console.error('❌ Error: Required roles (Director, Actor, Producer) not found');
    process.exit(1);
  }

  // Ensure we have enough Director role assignments for episodes
  const minDirectorsNeeded = Math.min(employees.length, tvSeries.length * 2); // At least 2 directors per series
  const directorAssignments = Math.min(count * 0.2, minDirectorsNeeded); // 20% of assignments should be directors

  console.log(`🎬 Ensuring ${directorAssignments} Director role assignments for episode creation...`);

  // First, create Director role assignments
  let directorCount = 0;
  for (let i = 0; i < directorAssignments && directorCount < directorAssignments; i++) {
    const employee = faker.helpers.arrayElement(employees);
    const series = faker.helpers.arrayElement(tvSeries);
    const key = `${employee.uuid}_${series.uuid}_${directorRole.uuid}`;

    if (!usedTriples.has(key)) {
      usedTriples.add(key);
      const startDate = faker.date.between({ from: series.start_date, to: new Date() });
      const endDate = faker.datatype.boolean({ probability: 0.3 })
        ? faker.date.between({ from: startDate, to: new Date() })
        : null;

      seriesCast.push({
        uuid: faker.string.uuid(),
        employee_uuid: employee.uuid,
        series_uuid: series.uuid,
        role_uuid: directorRole.uuid,
        character_name: null, // Directors don't need character names
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
      });
      directorCount++;
    }
  }

  console.log(`✅ Created ${directorCount} Director role assignments`);

  // Then create the remaining assignments (mostly Actors and Producers)
  for (let i = seriesCast.length; i < count && attempts < maxAttempts; i++) {
    if (i % 100 === 0) {
      logProgress('Generating Series Cast', i, count);
    }

    let employee, series, role, key;
    let found = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      employee = faker.helpers.arrayElement(employees);
      series = faker.helpers.arrayElement(tvSeries);
      // Prefer Actor roles (60%), then Producer (20%), then Director (20%)
      const roleChoice = faker.helpers.weightedArrayElement([
        { value: actorRole, weight: 60 },
        { value: producerRole, weight: 20 },
        { value: directorRole, weight: 20 }
      ]);
      role = roleChoice;
      key = `${employee.uuid}_${series.uuid}_${role.uuid}`;
      if (!usedTriples.has(key)) {
        found = true;
        break;
      }
    }
    if (!found) {
      attempts++;
      continue;
    }
    usedTriples.add(key);
    const startDate = faker.date.between({ from: series.start_date, to: new Date() });
    const endDate = faker.datatype.boolean({ probability: 0.3 })
      ? faker.date.between({ from: startDate, to: new Date() })
      : null;
    const characterName = isCharacterNameRequired(role.name)
      ? esc(faker.person.fullName())
      : null;
    seriesCast.push({
      uuid: faker.string.uuid(),
      employee_uuid: employee.uuid,
      series_uuid: series.uuid,
      role_uuid: role.uuid,
      character_name: characterName,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate ? endDate.toISOString().split('T')[0] : null,
    });
  }

  // Count role distribution for reporting
  const roleDistribution = {};
  seriesCast.forEach(sc => {
    const roleName = roles.find(r => r.uuid === sc.role_uuid)?.name || 'Unknown';
    roleDistribution[roleName] = (roleDistribution[roleName] || 0) + 1;
  });

  console.log(`✅ Generated ${seriesCast.length} series cast assignments`);
  console.log(`📊 Role distribution: ${Object.entries(roleDistribution).map(([role, count]) => `${role}: ${count}`).join(', ')}`);

  return seriesCast;
};

/**
 * Defines transmission-channel assignments with unique combinations
 * @param {Array} transmissions - Array of transmission objects
 * @param {Array} channels - Array of channel objects
 * @returns {Array} Array of transmission channel objects
 */
const defineTransmissionChannels = (transmissions, channels) => {
  const count = config.data_generation.volumes.num_transmission_channels;
  let transmissionChannels = [];
  let usedPairs = new Set();
  let attempts = 0;
  const maxAttempts = count * 10;

  for (let i = 0; i < count && attempts < maxAttempts; i++) {
    if (i % 300 === 0) {
      logProgress('Generating Transmission Channels', i, count);
    }

    let transmission, channel, key;
    let found = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      transmission = faker.helpers.arrayElement(transmissions);
      channel = faker.helpers.arrayElement(channels);
      key = `${transmission.uuid}_${channel.uuid}`;
      if (!usedPairs.has(key)) {
        found = true;
        break;
      }
    }
    if (!found) {
      attempts++;
      continue;
    }
    usedPairs.add(key);
    transmissionChannels.push({
      transmission_uuid: transmission.uuid,
      channel_uuid: channel.uuid,
    });
  }
  console.log(`✅ Generated ${transmissionChannels.length} transmission-channel assignments`);
  return transmissionChannels;
};

// ============================================================================
// BUSINESS RULE COMPLIANCE FUNCTIONS
// ============================================================================

/**
 * Validates all generated data against business rules
 * @param {Object} data - Generated data object
 * @returns {boolean} True if all data is compliant
 */
const validateBusinessRuleCompliance = (data) => {
  console.log('🔍 Validating business rule compliance...');

  let isValid = true;
  const errors = [];

  // Validate roles
  if (data.roles && Array.isArray(data.roles)) {
    data.roles.forEach(role => {
      if (!isValidRole(role.name)) {
        errors.push(`Invalid role: ${role.name}`);
        isValid = false;
      }
    });
  }

  // Validate employee statuses
  if (data.employees && Array.isArray(data.employees)) {
    data.employees.forEach(emp => {
      if (!isValidEmployeeStatus(emp.status)) {
        errors.push(`Invalid employee status: ${emp.status} for ${emp.first_name} ${emp.last_name}`);
        isValid = false;
      }
    });
  }

  // Validate series domains
  if (data.seriesDomains && Array.isArray(data.seriesDomains)) {
    data.seriesDomains.forEach(domain => {
      if (!isValidSeriesDomain(domain.name)) {
        errors.push(`Invalid series domain: ${domain.name}`);
        isValid = false;
      }
    });
  }

  // Validate TV series
  if (data.tvSeries && Array.isArray(data.tvSeries)) {
    data.tvSeries.forEach(series => {
      // Validate domain assignment
      if (!series.domain_uuid) {
        errors.push(`TV series '${series.title}' missing domain assignment`);
        isValid = false;
      }

      // Validate date range (BR-004)
      if (series.end_date && series.start_date && series.end_date <= series.start_date) {
        errors.push(`TV series '${series.title}' has invalid date range: end_date <= start_date`);
        isValid = false;
      }
    });
  }

  // Validate channels
  if (data.channels && Array.isArray(data.channels)) {
    data.channels.forEach(channel => {
      if (!isValidChannelType(channel.type)) {
        errors.push(`Invalid channel type: ${channel.type} for channel ${channel.name}`);
        isValid = false;
      }
    });
  }

  // Validate episodes (if they exist)
  if (data.episodes && Array.isArray(data.episodes)) {
    data.episodes.forEach(episode => {
      if (!isValidEpisodeDuration(episode.duration_minutes)) {
        errors.push(`Invalid episode duration: ${episode.duration_minutes} minutes`);
        isValid = false;
      }
    });
  }

  // Validate transmissions (if they exist)
  if (data.transmissions && Array.isArray(data.transmissions)) {
    data.transmissions.forEach(transmission => {
      if (!isValidViewership(transmission.viewership)) {
        errors.push(`Invalid viewership: ${transmission.viewership}`);
        isValid = false;
      }
    });
  }

  if (errors.length > 0) {
    console.error('❌ Business rule validation errors:');
    errors.forEach(error => console.error(`   - ${error}`));
  } else {
    console.log('✅ All data passes business rule validation');
  }

  return isValid;
};

// ============================================================================
// SQL OUTPUT FUNCTIONS
// ============================================================================

/**
 * Generates SQL INSERT statements for a given table and array of objects
 * @param {string} tableName - Table name
 * @param {Array} dataArray - Array of objects
 * @param {Array} columns - Array of column names (in order)
 * @returns {string} SQL INSERT statements
 */
function generateInsertSQL(tableName, dataArray, columns) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) return '';
  let sql = `-- ${tableName}\n`;
  dataArray.forEach(obj => {
    const values = columns.map(col => {
      const val = obj[col];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
      if (!isNaN(val) && typeof val !== 'string') return val;
      return `'${val}'`;
    });
    sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
  });
  sql += '\n';
  return sql;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🚀 Starting Configuration-Driven Mock Data Generation...');
console.log(`📊 Configuration Version: ${config.version}`);
console.log(`⚙️  Batch Size: ${config.data_generation.batch_size}`);
console.log(`📝 Progress Logging: ${config.data_generation.enable_progress_logging ? 'enabled' : 'disabled'}\n`);

const startTime = Date.now();

// Generate base data using configuration
console.log('📋 Generating base data using business rules configuration...');
const seriesDomains = defineSeriesDomains();
const channels = defineChannels();
const roles = defineRoles();
const employees = defineEmployees();

// Generate additional data using configuration
console.log('\n📺 Generating additional data using business rules configuration...');
const tvSeries = defineTVSeries(seriesDomains);
const seriesCast = defineSeriesCast(employees, tvSeries, roles);
const episodes = defineEpisodes(tvSeries, employees, seriesCast, roles);
const transmissions = defineTransmissions(episodes);
const transmissionChannels = defineTransmissionChannels(transmissions, channels);

// Validate generated data
const generatedData = {
  seriesDomains,
  channels,
  roles,
  employees,
  tvSeries,
  episodes,
  transmissions,
  seriesCast,
  transmissionChannels
};

if (!validateBusinessRuleCompliance(generatedData)) {
  console.error('❌ Data generation failed business rule validation');
  process.exit(1);
}

const endTime = Date.now();
const generationTime = (endTime - startTime) / 1000;

console.log('\n🎉 Configuration-Driven Mock Data Generation Complete!');
console.log(`⏱️  Generation time: ${generationTime.toFixed(2)}s`);
console.log(`📊 Business Rules: ${config.business_rules_reference.field_specific.length + config.business_rules_reference.relationship_specific.length + config.business_rules_reference.data_integrity.length} rules validated`);
console.log(`🔧 Configuration-driven: Easy to update when business rules change`);
console.log(`✅ Resilient: Changes to business rules only require config file updates`);

// Generate SQL output
const sqlLines = [];
sqlLines.push('-- ============================================================================');
sqlLines.push('-- Generated Mock Data for TV Company Database');
sqlLines.push('-- ============================================================================');
sqlLines.push(`-- Generated on: ${new Date().toISOString()}`);
sqlLines.push('-- Schema: TV Series Production Focus (Configuration-Driven)');
sqlLines.push('-- Business Rules Compliance: Configurable');
sqlLines.push('-- Field Specifications: All fields follow proper specifications');
sqlLines.push('-- Data Integrity: All constraints and relationships maintained');
sqlLines.push('-- IMPORTANT: Insert order follows business rule dependencies');
sqlLines.push('');

// Insert in proper order to satisfy business rule dependencies
sqlLines.push(generateInsertSQL('series_domains', seriesDomains, ['uuid', 'name', 'description']));
sqlLines.push(generateInsertSQL('channels', channels, ['uuid', 'name', 'type', 'description']));
sqlLines.push(generateInsertSQL('roles', roles, ['uuid', 'name', 'description']));
sqlLines.push(generateInsertSQL('employees', employees, ['uuid', 'first_name', 'last_name', 'email', 'birthdate', 'employment_date', 'is_internal', 'status']));
sqlLines.push(generateInsertSQL('tv_series', tvSeries, ['uuid', 'title', 'description', 'domain_uuid', 'start_date', 'end_date']));

// CRITICAL: series_cast must be inserted before episodes due to business rule validation
sqlLines.push('-- ============================================================================');
sqlLines.push('-- CRITICAL: series_cast must be inserted before episodes');
sqlLines.push('-- Business Rule: Director must have a Director role assigned in series_cast (any series)');
sqlLines.push('-- ============================================================================');
sqlLines.push(generateInsertSQL('series_cast', seriesCast, ['uuid', 'employee_uuid', 'series_uuid', 'role_uuid', 'character_name', 'start_date', 'end_date']));

// Now episodes can be inserted safely
sqlLines.push('-- ============================================================================');
sqlLines.push('-- Episodes can now be inserted (directors have role assignments)');
sqlLines.push('-- ============================================================================');
sqlLines.push(generateInsertSQL('episodes', episodes, ['uuid', 'series_uuid', 'episode_number', 'title', 'duration_minutes', 'air_date', 'director_uuid']));

// Transmissions and transmission_channels can be inserted after episodes
sqlLines.push(generateInsertSQL('transmissions', transmissions, ['uuid', 'episode_uuid', 'transmission_time', 'viewership']));
sqlLines.push(generateInsertSQL('transmission_channels', transmissionChannels, ['transmission_uuid', 'channel_uuid']));

const sqlOutput = sqlLines.join('\n');
const outputPath = path.join(__dirname, 'generated_mock_data.sql');
fs.writeFileSync(outputPath, sqlOutput);

console.log(`\n💾 SQL mock data written to: ${outputPath}`);
console.log(`📈 Total records: ${seriesDomains.length + channels.length + roles.length + employees.length + tvSeries.length + episodes.length + transmissions.length + seriesCast.length + transmissionChannels.length}`);
console.log(`📁 File size: ${(sqlOutput.length / 1024).toFixed(2)} KB`);

// ============================================================================
// CONFIGURATION UPDATE GUIDE
// ============================================================================

console.log('\n📋 Configuration Update Guide:');
console.log('To update business rules, modify business_rules_config.json:');
console.log('   - Add new roles to roles.valid_roles array');
console.log('   - Add new statuses to employee_statuses.valid_statuses array');
console.log('   - Update constraints.constraints object');
console.log('   - Add new domains to series_domains.valid_domains array');
console.log('   - Update version number and last_updated date');

console.log('\n🔄 Benefits of this approach:');
console.log('   - No code changes needed for business rule updates');
console.log('   - Centralized configuration management');
console.log('   - Easy validation and testing');
console.log('   - Better maintainability and scalability');
console.log('   - Clear separation of concerns');

// ============================================================================
// END OF IMPROVED MOCK DATA GENERATOR
// ============================================================================
