import { createFileRoute } from "@tanstack/react-router";
import { MiniMap } from "../components/MiniMap";
import { Nav } from "../components/Nav";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <>
      <Nav />
      <div className="p-2">
        <h3 className="text-2xl font-bold">About</h3>
        <MiniMap />

        <p className="mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p className="mt-4">
          Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam
          varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus
          magna felis sollicitudin mauris. Integer in mauris eu nibh euismod
          gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis
          risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue,
          eros est euismod turpis, id tincidunt sapien risus a quam.
        </p>

        <p className="mt-4">
          Maecenas fermentum consequat mi. Donec fermentum. Pellentesque
          malesuada nulla a mi. Duis sapien sem, aliquet sed, vulputate eget,
          feugiat non, dolor. Maecenas condimentum metus dignissim nunc.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Proin consequat auctor massa.
        </p>

        <p className="mt-4">
          Nulla facilisi. Nam libero tempore, cum soluta nobis est eligendi
          optio cumque nihil impedit quo minus id quod maxime placeat facere
          possimus, omnis voluptas assumenda est, omnis dolor repellendus.
          Temporibus autem quibusdam et aut officiis debitis aut rerum
          necessitatibus saepe eveniet ut et voluptates repudiandae sint et
          molestiae non recusandae.
        </p>

        <p className="mt-4">
          Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis
          voluptatibus maiores alias consequatur aut perferendis doloribus
          asperiores repellat. Sed ut perspiciatis unde omnis iste natus error
          sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
          eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
          vitae dicta sunt explicabo.
        </p>

        <p className="mt-4">
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
          sit amet, consectetur, adipisci velit, sed quia non numquam eius modi
          tempora incidunt ut labore et dolore magnam aliquam quaerat
          voluptatem.
        </p>

        <p className="mt-4">
          Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
          autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
          nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
          voluptas nulla pariatur?
        </p>

        <p className="mt-4">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui
          blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
          et quas molestias excepturi sint occaecati cupiditate non provident,
          similique sunt in culpa qui officia deserunt mollitia animi, id est
          laborum et dolorum fuga.
        </p>

        <p className="mt-4">
          Et harum quidem rerum facilis est et expedita distinctio. Nam libero
          tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
          minus id quod maxime placeat facere possimus, omnis voluptas assumenda
          est, omnis dolor repellendus.
        </p>

        <p className="mt-4">
          Temporibus autem quibusdam et aut officiis debitis aut rerum
          necessitatibus saepe eveniet ut et voluptates repudiandae sint et
          molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente
          delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut
          perferendis doloribus asperiores repellat.
        </p>
      </div>
    </>
  );
}
