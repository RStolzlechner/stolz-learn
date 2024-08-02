using FluentMigrator;

namespace StolzLearn.Core.Migrations;

[Migration(202407011545, "Initial Migration. Create uuid-ossp extension.")]
public class Migration_202407011545 : Migration
{
    public override void Up()
    {
        Execute.Sql("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"");
    }

    public override void Down()
    {
        Execute.Sql("DROP EXTENSION IF EXISTS \"uuid-ossp\"");
    }
}