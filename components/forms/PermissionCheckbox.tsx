"use client";

type PermissionCheckboxProps = {
  error?: string;
  disabled?: boolean;
};

export function PermissionCheckbox({ error, disabled }: PermissionCheckboxProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-start gap-3 rounded-2xl border border-lilac-border/60 bg-pale-lilac/28 p-4 text-sm leading-6 text-espresso/68">
        <input
          type="checkbox"
          name="permission"
          disabled={disabled}
          className="mt-1 size-4 rounded border-lilac-border text-deep-lilac focus:ring-deep-lilac/30 disabled:opacity-50"
        />
        <span>
          I give permission for my message and selected media to be included in Elizabeth&apos;s private birthday archive.
        </span>
      </label>
      {error ? (
        <p className="text-sm font-semibold leading-6 text-deep-lilac" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
