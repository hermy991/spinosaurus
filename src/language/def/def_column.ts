
export class DefColumn{
  constructor(
    public type?: string, // ColumnType - Column type. One of the supported column types.
    public name?: string, // Column name in the database table. By default the column name is generated from the name of the property. You can change it by specifying your own name.
    public length?: string|number, // Column type's length. For example, if you want to create varchar(150) type you specify column type and length options.
    // public width?: number, // column type's display width. Used only for MySQL integer types
    // onUpdate: string - ON UPDATE trigger. Used only in MySQL.
    public nullable?: boolean, // Makes column NULL or NOT NULL in the database. By default column is nullable: false.
    public update?: boolean, // Indicates if column value is updated by "save" operation. If false, you'll be able to write this value only when you first time insert the object. Default value is true.
    public insert?: boolean, // Indicates if column value is set the first time you insert the object. Default value is true.
    public select?: boolean, // Defines whether or not to hide this column by default when making queries. When set to false, the column data will not show with a standard query. By default column is select: true
    public defaul?: string|number|boolean|Date, // Adds database-level column's DEFAULT value.
    // primary: boolean, // Marks column as primary. Same as using @PrimaryColumn.
    public unique?: boolean, // Marks column as unique column (creates unique constraint). Default value is false.
    public comment?: string, // Database's column comment. Not supported by all database types.
    public precision?: string|number, // The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum number of digits that are stored for the values. Used in some column types.
    public scale?: string|number, // The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number of digits to the right of the decimal point and must not be greater than precision. Used in some column types.
    // zerofill: boolean, // Puts ZEROFILL attribute on to a numeric column. Used only in MySQL. If true, MySQL automatically adds the UNSIGNED attribute to this column.
    // unsigned: boolean, // Puts UNSIGNED attribute on to a numeric column. Used only in MySQL.
    // charset: string, // Defines a column character set. Not supported by all database types.
    // public collation?: string, // Defines a column collation.
  ){}
}