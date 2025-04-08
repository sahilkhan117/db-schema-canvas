
import { Parser, exporter } from '@dbml/core';

interface DbmlField {
  name: string;
  type: string;
  pk?: boolean;
  unique?: boolean;
  notNull?: boolean;
  fk?: {
    table: string;
    field: string;
  };
}

export interface DbmlTable {
  name: string;
  fields: DbmlField[];
}

export interface DbmlSchema {
  tables: DbmlTable[];
  refs: Array<{
    source: { table: string; field: string };
    target: { table: string; field: string };
  }>;
}

export async function parseDBML(dbmlString: string): Promise<DbmlSchema> {
  try {
    const parsed = await Parser.parse(dbmlString, 'dbml');
    const jsonData = exporter.export(parsed, 'json');
    
    if (typeof jsonData !== 'string') {
      throw new Error('Failed to export DBML to JSON');
    }
    
    const parsedData = JSON.parse(jsonData);
    
    // Process tables
    const tables = parsedData.tables.map((table: any) => {
      return {
        name: table.name,
        fields: table.fields.map((field: any) => {
          const fieldData: DbmlField = {
            name: field.name,
            type: field.type.type_name || 'unknown'
          };
          
          if (field.pk) fieldData.pk = true;
          if (field.unique) fieldData.unique = true;
          if (field.not_null) fieldData.notNull = true;
          
          return fieldData;
        })
      };
    });
    
    // Process references
    const refs = parsedData.refs.map((ref: any) => {
      return {
        source: {
          table: ref.endpoints[0].tableName,
          field: ref.endpoints[0].fieldNames[0] || ''
        },
        target: {
          table: ref.endpoints[1].tableName,
          field: ref.endpoints[1].fieldNames[0] || ''
        }
      };
    });
    
    return {
      tables,
      refs
    };
  } catch (error) {
    console.error('Error parsing DBML:', error);
    return {
      tables: [],
      refs: []
    };
  }
}

export async function validateDBML(dbmlString: string): Promise<{ valid: boolean; error?: string }> {
  try {
    await Parser.parse(dbmlString, 'dbml');
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || 'Invalid DBML'
    };
  }
}
