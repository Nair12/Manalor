using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ImageGalleryApi.Migrations
{
    /// <inheritdoc />
    public partial class changeTypeForColumnImageIdInTableLikes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageId",
                table: "Likes");

            migrationBuilder.AddColumn<Guid>(
                name: "ImageGuid",
                table: "Likes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageGuid",
                table: "Likes");

            migrationBuilder.AddColumn<int>(
                name: "ImageId",
                table: "Likes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
