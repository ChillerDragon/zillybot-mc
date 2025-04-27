{
  description = "zillybot";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable-small";
  };
  outputs =
    inputs@{ self, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      perSystem =
        { self', pkgs, ... }:
        let
          buildNpmPackage = pkgs.buildNpmPackage.override { nodejs = pkgs.nodejs_22; };
        in
        {
          packages = {
            zillybot = buildNpmPackage {
              pname = "zillybot";
              version = toString (self.shortRev or self.dirtyShortRev or self.lastModified or "unknown");
              src = ./.;
              npmDepsHash = "sha256-S3389l4KDZF3A8NAK/dKgMBZcMsBsrR1cCiPVeNM++g=";
              dontNpmBuild = true;
              meta.mainProgram = "zillybot";
            };
            default = self'.packages.zillybot;
          };

          devShells.default = pkgs.mkShell {
            packages = [ ];
            inputsFrom = [ self'.packages.default ];
          };
        };
      systems = inputs.nixpkgs.lib.systems.flakeExposed;
    };
}
