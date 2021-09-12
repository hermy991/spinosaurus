export const findSchema = (req: { name: string }) => `
SELECT catalog_name "database"
    , schema_name "schema"
    , schema_owner "owner"
    , default_character_set_catalog
    , default_character_set_schema
    , default_character_set_name
    , sql_path
FROM information_schema.schemata
WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
  AND schema_name = '${req.name}'
`;

export const findColumns = () => `
SELECT c.table_catalog
  ,c.table_schema
  ,c.table_name
  ,c.column_name
  ,c.ordinal_position
  ,c.column_default
  ,c.is_nullable
  ,c.data_type
  ,c.character_maximum_length
  ,c.character_octet_length
  ,c.numeric_precision
  ,c.numeric_precision_radix
  ,c.numeric_scale
  ,c.datetime_precision
  ,c.interval_type
  ,c.interval_precision
  ,c.character_set_catalog
  ,c.character_set_schema
  ,c.character_set_name
  ,c.collation_catalog
  ,c.collation_schema
  ,c.collation_name
  ,c.domain_catalog
  ,c.domain_schema
  ,c.domain_name
  ,c.udt_catalog
  ,c.udt_schema
  ,c.udt_name
  ,c.scope_catalog
  ,c.scope_schema
  ,c.scope_name
  ,c.maximum_cardinality
  ,c.dtd_identifier
  ,c.is_self_referencing
  ,c.is_identity
  ,c.identity_generation
  ,c.identity_start
  ,c.identity_increment
  ,c.identity_maximum
  ,c.identity_minimum
  ,c.identity_cycle
  ,c.is_generated
  ,c.generation_expression
  ,c.is_updatable
  , ccu.constraint_name constraint_primary_key_name
FROM  information_schema.columns c
    LEFT JOIN information_schema.table_constraints tc ON tc.constraint_schema = c.table_schema
                                                      AND tc.table_name = c.table_name
                                                      AND tc.constraint_type = 'PRIMARY KEY'
        LEFT JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_schema = tc.constraint_schema
                                                                      AND ccu.constraint_name = tc.constraint_name
                                                                      AND ccu.column_name = c.column_name
WHERE c.table_schema NOT IN('pg_catalog','information_schema','pg_toast')
ORDER BY c.table_catalog ASC, c.table_schema ASC, c.table_name ASC, c.ordinal_position ASC
`;

export const findConstraints = () => `
SELECT tc.constraint_catalog
  , tc.constraint_schema
  , tc.constraint_name
  , tc.table_catalog
  , tc.table_schema
  , tc.table_name
  , tc.constraint_type  
  , COALESCE ( STRING_AGG(kcu.column_name, ','), (SELECT STRING_AGG(ccux.column_name, ',')
                               FROM information_schema.constraint_column_usage ccux
                               WHERE ccux.constraint_catalog = tc.constraint_catalog 
                                  AND ccux.constraint_schema = tc.constraint_schema
                                  AND ccux.constraint_name = tc.constraint_name
                              ) ) column_names
  , ccu.table_catalog AS foreign_table_catalog
  , ccu.table_schema AS foreign_table_schema
  , ccu.table_name AS foreign_table_name
  , STRING_AGG(ccu.column_name, ',') AS foreign_column_names 
  , cc.check_clause
FROM information_schema.table_constraints tc 
  LEFT JOIN information_schema.key_column_usage AS kcu ON kcu.constraint_name = tc.constraint_name
                                                 AND kcu.table_catalog = tc.table_catalog 
                                                 AND kcu.table_schema = tc.table_schema
                                                 AND kcu.table_name = tc.table_name 
      LEFT JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_catalog = tc.constraint_catalog 
                                                              AND ccu.constraint_schema = tc.constraint_schema
                                                              AND ccu.constraint_name = tc.constraint_name
                                                              AND tc.constraint_type = 'FOREIGN KEY'
          LEFT JOIN information_schema.check_constraints cc ON cc.constraint_schema = tc.constraint_schema
                                                           AND cc.constraint_name = tc.constraint_name 
WHERE tc.table_schema NOT IN ('pg_catalog','information_schema','pg_toast')
  AND NOT ( tc.constraint_type = 'CHECK' AND tc.constraint_name LIKE '%_not_null')
GROUP BY tc.constraint_catalog
  , tc.constraint_schema
  , tc.constraint_name
  , tc.table_catalog
  , tc.table_schema
  , tc.table_name
  , tc.constraint_type
  , ccu.table_catalog
  , ccu.table_schema
  , ccu.table_name
  , cc.check_clause
ORDER BY tc.table_catalog
  , tc.table_schema
  , tc.table_name
`;
