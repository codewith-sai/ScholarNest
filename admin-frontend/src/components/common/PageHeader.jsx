const PageHeader = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      
      <div>
        <h1 className="text-2xl font-bold text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}

    </div>
  );
};

export default PageHeader;